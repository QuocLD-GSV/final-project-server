import { CommentsRepository } from '@app/common/repositories/comments.repository';
import { UsersRepository } from '@app/common/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsReppsitory: CommentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getAllPostComments(postId: Types.ObjectId) {
    const comments = await this.commentsReppsitory.returnAllCommentOfPost(
      postId,
    );

    return comments;
  }
}
