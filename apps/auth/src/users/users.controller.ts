import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import JwtAuthGuard from '../guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserById(@Req() request: any) {
    return this.usersService.getUserById(new Types.ObjectId(request.user._id));
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Post('follow')
  async userFollow(@Payload() data: FollowUserDto) {}
}
