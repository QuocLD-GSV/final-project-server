import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import RefreshToken from './entities/refresh-token.entity';
import { User } from './users/schemas/user.schema';
import { sign } from 'jsonwebtoken';
import { UsersService } from './users/users.service';
import { Types } from 'mongoose';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async login(
    user: User,
    response: Response,
    values: { userAgent: string; ipAddress: string },
  ) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const expiresLogin = new Date();
    expiresLogin.setSeconds(
      expiresLogin.getSeconds() +
        this.configService.get('JWT_REFRESH_EXPIRATION'),
    );

    const payload = await this.newRefreshAndAccessToken(user, values);

    //add refreshToken to User
    await this.userService.addNewRefreshToken({
      refreshToken: payload.refreshToken,
      user_id: user._id,
    });

    response.cookie('Authentication', payload.accessToken, {
      httpOnly: true,
      expires,
    });

    response.cookie('RefreshToken', payload.refreshToken, {
      httpOnly: true,
      expires: expiresLogin,
    });

    response.cookie('Roles', payload.roles, {
      httpOnly: true,
      expires: expiresLogin,
    });
  }

  async logout(
    response: Response,
    values: { refreshToken: string; user_id: Types.ObjectId },
  ) {
    await this.userService.removeRefreshToken(values);

    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });

    response.cookie('RefreshToken', '', {
      httpOnly: true,
      expires: new Date(),
    });

    response.cookie('Roles', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  private async newRefreshAndAccessToken(
    user: User,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string; roles: any }> {
    const refreshObject = new RefreshToken({
      user_id: user._id,
      userAgent: values.userAgent,
      ipAddress: values.ipAddress,
      roles: user.roles,
    });
    return {
      accessToken: sign(
        {
          userId: user._id,
          roles: user.roles,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '6000s',
        },
      ),
      refreshToken: refreshObject.sign(),
      roles: user.roles,
    };
  }
}
