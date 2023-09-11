import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { GetAllPostCommentsDto } from './dto/get-all-post-comments';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all-post-comments')
  async getAllPostComments(@Query('postId') postId: string) {
    if (postId == null || postId == undefined) {
      return new HttpException('require postId query!', HttpStatus.BAD_REQUEST);
    }
    return this.commentsService.getAllPostComments(
      new Types.ObjectId(String(postId)),
    );
  }
}
