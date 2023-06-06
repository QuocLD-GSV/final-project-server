import { Controller, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Ip() ipAddress: any,
    @Req() request: any,
  ) {
    await this.authService.login(user, response, {
      ipAddress: ipAddress,
      userAgent: request.userAgent,
    });
    response.send({ ...user, password: null, authenticate: null });
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.logout(response, {
      refreshToken: request.cookies['RefreshToken'],
      user_id: user._id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request.cookies['RefreshToken'], response);
  }
}
