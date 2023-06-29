import { JwtAuthGuard } from '@app/common';
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentToPostDto } from './dto/comment-post.dto';
import { CreateCommentReplyDto } from './dto/comment-reply.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentErrors } from './errors/comments.errors';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ description: 'Get all comment and reply of post' })
  @ApiCreatedResponse({ description: 'Return a list of comments' })
  @Get(':post_id')
  getAllCommentOfPost(@Param() params: any) {
    return this.commentsService.getAllCommentOfPost(
      new Types.ObjectId(params.post_id),
    );
  }

  @ApiOperation({ description: 'Create new comment to post' })
  @ApiCreatedResponse({ description: 'Return new Comment' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: CreateCommentToPostDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  createCommentToPost(
    @Payload() data: CreateCommentToPostDto,
    @Req() request: any,
  ) {
    return this.commentsService.createCommentToPost(
      data,
      new Types.ObjectId(request.user._id),
    );
  }

  @ApiOperation({ description: 'Create new reply to comment' })
  @ApiCreatedResponse({ description: 'Return new Comment' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('reply')
  commentReply(@Payload() data: CreateCommentReplyDto, @Req() request: any) {
    return this.commentsService.createCommentReply(
      data,
      new Types.ObjectId(request.user._id),
    );
  }

  @ApiOperation({ description: 'like or unlike a comment' })
  @ApiCreatedResponse({ description: 'return new like' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch('like')
  likeComment(@Payload() data: LikeCommentDto, @Req() request: any) {
    return this.commentsService.likeComment(
      data,
      new Types.ObjectId(request.user._id),
    );
  }

  @ApiOperation({
    description: 'update comment, availble for admin and comment owner',
  })
  @ApiCreatedResponse({ description: 'return new like' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateComment(@Payload() data: UpdateCommentDto, @Req() request: any) {
    if (!request.user.roles.includes('admin')) {
      const comment = await this.commentsService.getCommentById(
        new Types.ObjectId(data.comment_id),
      );

      if (String(comment.author_id) !== request.user._id) {
        throw new HttpException(
          CommentErrors.ONLY_PERMITTION_OWNER,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.commentsService.updateComment(data);
  }

  @ApiOperation({
    description: 'delete a comment, availble for comment owner and admin',
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch('delete')
  async deleteComment(@Payload() data: DeleteCommentDto, @Req() request: any) {
    if (!request.user.roles.includes('admin')) {
      const comment = await this.commentsService.getCommentById(
        new Types.ObjectId(data.comment_id),
      );

      if (String(comment.author_id) !== request.user._id) {
        throw new HttpException(
          CommentErrors.ONLY_PERMITTION_OWNER,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.commentsService.deleteComment(data);
  }
}
