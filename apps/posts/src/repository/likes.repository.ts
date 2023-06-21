import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Like } from '../schemas/like.schema';

@Injectable()
export class LikesRepository extends AbstractRepository<Like> {
  protected readonly logger = new Logger(LikesRepository.name);

  constructor(
    @InjectModel(Like.name) likeModel: Model<Like>,
    @InjectConnection() connection: Connection,
  ) {
    super(likeModel, connection);
  }
}
