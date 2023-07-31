import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import LocalJwtAuthGuard from '../guards/local-jwt-auth.guard';
import { CreateUserRequest } from './dto/create-user.request';
import { FollowUserDto } from './dto/follow-user.dto';
import { UsersService } from './users.service';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'register new user' })
  @Post('register')
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Get('id')
  getUserById(@Req() request: any) {
    return this.usersService.getUserById(
      new Types.ObjectId('64c4df8afcf9ee26836db38d'),
    );
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @ApiOperation({ description: 'follow a user by current user' })
  @ApiUnauthorizedResponse({ description: 'login first to follow user' })
  @UseGuards(LocalJwtAuthGuard)
  @Patch('follow')
  userFollow(@Payload() data: FollowUserDto, @Req() request: any) {
    return this.usersService.userFollow({
      currentUserId: new Types.ObjectId(request.user._id),
      targetUserId: new Types.ObjectId(data.user_id),
    });
  }
}
