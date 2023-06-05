import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './schemas/user.schema';
import { Types } from 'mongoose';

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

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUserById(id: Types.ObjectId) {
    return this.usersRepository.findOne({ _id: id });
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
    const user = await this.getUserById(values.user_id);
    user.authenticate.filter((authObject) => {
      authObject.refreshToken === values.refreshToken;
    });
    await user.save();
  }
}
