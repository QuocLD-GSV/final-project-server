import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
}
