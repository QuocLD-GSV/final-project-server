import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { GetAllPostCommentsDto } from './dto/get-all-post-comments';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all-post-comments')
  async getAllPostComments(@Payload() data: GetAllPostCommentsDto) {
    return this.commentsService.getAllPostComments(
      new Types.ObjectId(data.postId),
    );
  }
}
