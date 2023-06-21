import { JwtAuthGuard } from '@app/common';
import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentToPostDto } from './dto/comment-post.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
}
