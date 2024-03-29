import { AbstractRepository } from '@app/common';
import { Comment } from '@app/common/models/schemas/comment.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

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
    let commentsData = await this.model.find({ postId: post_id }).populate({
      path: 'author_id',
      model: 'User',
      select: ['_id', 'firstName', 'lastName', 'avatar'],
    });

    const transformedComments: Comment[] = commentsData.map((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        const transformedReplies: Comment[] = comment.replies.map((replyId) => {
          const replyIndex = commentsData.findIndex(
            (c) => String(c._id) === String(replyId),
          );
          if (replyIndex !== -1) {
            const reply = commentsData[replyIndex];
            commentsData.splice(replyIndex, 1);
            return reply;
          }
          return null;
        });
        comment.replies = transformedReplies;
      }
      return comment;
    });
    return transformedComments;
  }
}
