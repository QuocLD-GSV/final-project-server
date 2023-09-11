import { AbstractRepository } from '@app/common';
import { Post } from '@app/common/models/schemas/post.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(
    @InjectModel(Post.name) postModule: Model<Post>,
    @InjectConnection() connection: Connection,
  ) {
    super(postModule, connection);
  }

  async findAndPaginatePublicPosts(
    filterQuery: FilterQuery<Post>,
    filterOption: { pageNumber: number; pageSize: number },
  ): Promise<Post[]> {
    const skipAmount = (filterOption.pageNumber - 1) * filterOption.pageSize;

    return await this.model
      .find(filterQuery, {}, { lean: true })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(filterOption.pageSize)
      .populate({
        path: 'user_id',
        model: 'User',
        select: ['_id', 'firstName', 'lastName', 'avatar'],
      })
      .populate({
        path: 'comments',
        model: 'Comment',
      })
      .populate({
        path: 'likes',
        model: 'Like',
      });
  }

  async getAllInforPostById(postId: Types.ObjectId) {
    return await this.model
      .findOne(
        {
          _id: postId,
        },
        {},
        { lean: true },
      )
      .populate({
        path: 'user_id',
        model: 'User',
        select: ['_id', 'firstName', 'lastName', 'avatar'],
      })
      .populate({
        path: 'comments',
        model: 'Comment',
      })
      .populate({
        path: 'likes',
        model: 'Like',
      });
  }
}
