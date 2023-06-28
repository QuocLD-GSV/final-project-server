import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';

@Injectable()
export class CommentsRepository extends AbstractRepository<Comment> {
  protected readonly logger = new Logger(CommentsRepository.name);

  constructor(
    @InjectModel(Comment.name) commentModel: Model<Comment>,
    @InjectConnection() connection: Connection,
  ) {
    super(commentModel, connection);
  }

  async returnComment(commentId: Types.ObjectId) {
    return (await this.model.findOne({ _id: commentId })).populate({
      path: 'author_id',
      model: 'User',
      select: ['email', '_id'],
    });
  }

  async returnAllCommentOfPost(post_id: Types.ObjectId) {
    return await this.model.find({ postId: post_id }).populate({
      path: 'replies',
      model: 'Comment',
      select: ['author_id', 'content', 'like_id', 'createdAt'],
    });
  }
}
