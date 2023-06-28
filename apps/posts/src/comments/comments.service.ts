import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { HTTPExceptions } from '../../../../libs/common/src/decorators/try-catch';
import { LikesRepository } from '../repository/likes.repository';
import { PostsRepository } from '../repository/posts.repository';
import { CreateCommentToPostDto } from './dto/comment-post.dto';
import { CreateCommentReplyDto } from './dto/comment-reply.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { CommentErrors } from './errors/comments.errors';
import { CommentsRepository } from './repositorys/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
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

    await this.postsRepository.findOneAndUpdate(
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

  @HTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
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

  @HTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getAllCommentOfPost(postId: Types.ObjectId) {
    return await this.commentsRepository.returnAllCommentOfPost(postId);
  }

  @HTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async likeComment(data: LikeCommentDto, user_id: Types.ObjectId) {
    const exitLike = await this.likesRepository.findOne({
      author_id: user_id,
      comment_id: data.comment_id,
    });

    if (exitLike) {
      await this.likesRepository.findOneAndUpdate(
        { _id: exitLike._id },
        { unliked: !exitLike.unliked },
      );
    } else {
      const like = await this.likesRepository.create({
        author_id: user_id,
        comment_id: data.comment_id,
        unlike: false,
      });

      await this.commentsRepository.findOneAndUpdate(
        { _id: data.comment_id },
        {
          $addToSet: {
            likes: like._id,
          },
        },
      );
    }

    const returnLikes = await this.likesRepository.find({
      comment_id: data.comment_id,
    });

    return returnLikes;
  }
}
