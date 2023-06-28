import { JwtAuthGuard } from '@app/common';
import { Controller, Post, UseGuards, Req, Get, Param } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentToPostDto } from './dto/comment-post.dto';
import { CreateCommentReplyDto } from './dto/comment-reply.dto';
import { LikeCommentDto } from './dto/like-comment.dto';

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
  @Post('like')
  likeComment(@Payload() data: LikeCommentDto, @Req() request: any) {
    return this.commentsService.likeComment(
      data,
      new Types.ObjectId(request.user._id),
    );
  }
}
