import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentsRepository } from '../repository/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsReppsitory: CommentsRepository) {}
  async getAllPostComments(postId: Types.ObjectId) {
    return await this.commentsReppsitory.returnAllCommentOfPost(postId);
  }
}
