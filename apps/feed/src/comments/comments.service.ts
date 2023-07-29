import { CommentsRepository } from '@app/common/repositories/comments.repository';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsReppsitory: CommentsRepository) {}
  async getAllPostComments(postId: Types.ObjectId) {
    return await this.commentsReppsitory.returnAllCommentOfPost(postId);
  }
}
