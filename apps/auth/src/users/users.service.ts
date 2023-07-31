import {
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

  @InjectionHTTPExceptions(authErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUserById(id: Types.ObjectId) {
    return await this.usersRepository.findOne(id);
  }

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

  async removeRefreshToken(values: {
    refreshToken: string;
    user_id: Types.ObjectId;
  }) {
    const { refreshToken, user_id } = values;
    return this.usersRepository.findOneAndUpdate(user_id, {
      $pull: { authenticate: { refreshToken } },
    });
  }

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

  async userFollow(data: {
    currentUserId: Types.ObjectId;
    targetUserId: Types.ObjectId;
  }) {
    return await this.usersRepository.findOneAndUpdate(
      { _id: data.targetUserId },
      {
        $addToSet: {
          follower: data.currentUserId,
        },
      },
    );
  }
}
