import { User } from '@app/common/models/schemas/user.schema';
import { Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import LocalJwtAuthGuard from './guards/local-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'login api' })
  @ApiUnauthorizedResponse({ description: 'cant login' })
  @ApiBody({
    type: class LoginDto {
      email: string;
      password: string;
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Ip() ipAddress: any,
    @Req() request: any,
  ) {
    const newUser = await this.authService.login(user, response, {
      ipAddress: ipAddress,
      userAgent: request.userAgent,
    });
    delete newUser.authenticate;
    delete newUser.password;
    return newUser;
  }

  @ApiOperation({ description: 'logout api' })
  @UseGuards(LocalJwtAuthGuard)
  @Post('logout')
  logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Req() request: any,
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

  @ApiOperation({ description: 'refresh api, send with cookies' })
  @Post('refresh')
  async refresh(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request.cookies['RefreshToken'], response);
  }

  @UseGuards(LocalJwtAuthGuard)
  @Get('test')
  async test(@Req() request: any) {
    console.log(request.cookies);
    return request.user;
  }
}
