import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dto/create-user.request';
import { Types } from 'mongoose';
import { InjectionHTTPExceptions } from '@app/common/decorators/try-catch';
import { authErrors } from '../errors/auth.errors';
import { User } from '@app/common/models/schemas/user.schema';
import { UsersRepository } from '@app/common/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll() {
    return this.usersRepository.find({});
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10),
      roles: ['user'],
      isDeleted: false,
      authenticate: [],
    });
    return user;
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @InjectionHTTPExceptions(authErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getUserById(id: Types.ObjectId) {
    return await this.usersRepository.findOne(id);
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async addNewRefreshToken(values: {
    refreshToken: string;
    user_id: Types.ObjectId;
  }) {
    const { refreshToken, user_id } = values;
    this.usersRepository.findOneAndUpdate(user_id, {
      $addToSet: {
        authenticate: { refreshToken },
      },
    });
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async removeRefreshToken(values: {
    refreshToken: string;
    user_id: Types.ObjectId;
  }) {
    const { refreshToken, user_id } = values;
    return this.usersRepository.findOneAndUpdate(user_id, {
      $pull: { authenticate: { refreshToken } },
    });
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async verifiyRefreshTokenLoggedIn(values: {
    refreshToken: string;
    user_id: Types.ObjectId;
  }): Promise<User | null> {
    const { refreshToken, user_id } = values;
    return await this.usersRepository.findOne({
      'authenticate.refreshToken': refreshToken,
      user_id: user_id,
    });
  }

  @InjectionHTTPExceptions(
    authErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async userFollow(data: {
    currentUserId: Types.ObjectId;
    targetUserId: Types.ObjectId;
  }) {
    const targetUserCheck = await this.usersRepository.findOne({
      _id: data.targetUserId,
      follower: data.currentUserId,
    });

    if ((data.currentUserId = data.targetUserId)) {
      throw new HttpException('cant not flow yourself', HttpStatus.BAD_REQUEST);
    }

    if (!targetUserCheck) {
      //Update from currentUser
      await this.usersRepository.findOneAndUpdate(
        { _id: data.currentUserId },
        {
          $addToSet: {
            following: data.targetUserId,
          },
        },
      );
      //Update from tagetUser
      const returnUser = await this.usersRepository.findOneAndUpdate(
        { _id: data.targetUserId },
        {
          $addToSet: {
            follower: data.currentUserId,
          },
        },
      );
      return returnUser;
    } else {
      //Update from currentUser
      await this.usersRepository.findOneAndUpdate(
        { _id: data.currentUserId },
        {
          $pull: {
            following: data.targetUserId,
          },
        },
      );

      //Update from tagetUser
      const returnUser = await this.usersRepository.findOneAndUpdate(
        { _id: data.targetUserId },
        {
          $pull: {
            follower: data.currentUserId,
          },
        },
      );
      return returnUser;
    }
  }
}
