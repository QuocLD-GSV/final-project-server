import { AbstractRepository } from '@app/common';
import { Like } from '@app/common/models/schemas/like.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
/**
 * TODO: comment Injectable
 * @description Injectable
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 */
@Injectable()
export class LikesRepository extends AbstractRepository<Like> {
  protected readonly logger = new Logger(LikesRepository.name);

  constructor(
    @InjectModel(Like.name) likeModel: Model<Like>,
    @InjectConnection() connection: Connection,
  ) {
    super(likeModel, connection);
  }

  async returnAllLike(postId: Types.ObjectId) {
    return await this.model
      .find(
        {
          post_id: postId,
          unliked: false,
          isDeleted: false,
        },
        {},
        { lean: true },
      )
      .populate({
        path: 'author_id',
        model: 'User',
        select: ['_id', 'firstName', 'lastName'],
      });
  }
}
