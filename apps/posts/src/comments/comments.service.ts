import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { HTTPExceptions } from '../../../../libs/common/src/decorators/try-catch';
import { LikesRepository } from '../repository/likes.repository';
import { PostsRepository } from '../repository/posts.repository';
import { CreateCommentToPostDto } from './dto/comment-post.dto';
import { CreateCommentReplyDto } from './dto/comment-reply.dto';
import { CommentErrors } from './errors/comments.errors';
import { CommentsRepository } from './repositorys/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postRepository: PostsRepository,
  ) {}

  @HTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createCommentToPost(
    data: CreateCommentToPostDto,
    user_id: Types.ObjectId,
  ) {
    const comment = await this.commentsRepository.create({
      ...data,
      author_id: user_id,
    });

    await this.postRepository.findOneAndUpdate(
      { _id: comment.postId },
      {
        $addToSet: {
          comments: comment._id,
        },
      },
    );

    const returnComment = await this.commentsRepository.returnComment(
      comment._id,
    );

    return returnComment;
  }

  async createCommentReply(
    data: CreateCommentReplyDto,
    user_id: Types.ObjectId,
  ) {
    const newReply = await this.commentsRepository.create({
      ...data,
      author_id: user_id,
    });

    await this.commentsRepository.findOneAndUpdate(
      { _id: data.parentComment },
      {
        $addToSet: {
          replies: newReply._id,
        },
      },
    );

    const returnComment = await this.commentsRepository.returnComment(
      newReply._id,
    );

    return returnComment;
  }

  async getAllCommentOfPost(postId: Types.ObjectId) {
    return await this.commentsRepository.returnAllCommentOfPost(postId);
  }
}
