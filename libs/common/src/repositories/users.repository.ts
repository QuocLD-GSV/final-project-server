import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { User } from '@app/common/models/schemas/user.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async returnUserDetail(userId: Types.ObjectId) {
    const user = await this.model
      .findOne({ _id: userId }, {}, { lean: true })
      .populate([
        {
          path: 'follower',
          model: 'User',
          select: ['email', '_id', 'firstName', 'lastName', 'avatar'],
        },
        {
          path: 'following',
          model: 'User',
          select: ['email', '_id', 'firstName', 'lastName', 'avatar'],
        },
      ]);
    return user;
  }

  async validateUserById(userId: Types.ObjectId) {
    return await this.model.find({ _id: userId }, {}, { lean: true });
  }
}
