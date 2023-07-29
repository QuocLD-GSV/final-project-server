import { CommentsRepository } from '@app/common/repositories/comments.repository';
import { LikesRepository } from '@app/common/repositories/likes.repository';
import { PostsRepository } from '@app/common/repositories/posts.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectionHTTPExceptions } from '../../../../libs/common/src/decorators/try-catch';
import { CreateCommentToPostDto } from './dto/comment-post.dto';
import { CreateCommentReplyDto } from './dto/comment-reply.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentErrors } from './errors/comments.errors';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createCommentToPost(data: {
    dataCreate: CreateCommentToPostDto;
    user_id: Types.ObjectId;
  }) {
    console.log('data: ' + data.user_id);
    const comment = await this.commentsRepository.create({
      ...data.dataCreate,
      author_id: data.user_id,
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

  @InjectionHTTPExceptions(
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

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getAllCommentOfPost(postId: Types.ObjectId) {
    return await this.commentsRepository.returnAllCommentOfPost(postId);
  }

  @InjectionHTTPExceptions(
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

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getCommentById(comment_id: Types.ObjectId) {
    return await this.commentsRepository.findOne({ _id: comment_id });
  }

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getPostByCommentId(comment_id: Types.ObjectId) {
    const comment = await this.commentsRepository.findOne({ _id: comment_id });

    return await this.postsRepository.findOne({ _id: comment.postId });
  }

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async updateComment(data: UpdateCommentDto) {
    const { comment_id, ...dataToUpdate } = data;
    return this.commentsRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(data.comment_id),
      },
      { ...dataToUpdate },
    );
  }

  @InjectionHTTPExceptions(
    CommentErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async deleteComment(data: DeleteCommentDto) {
    return this.commentsRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(data.comment_id),
      },
      {
        isDeleted: true,
      },
    );
  }
}
