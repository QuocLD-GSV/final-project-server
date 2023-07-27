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
import { GetPostByIdDto } from './dto/get-post-by-id.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get-post')
  getNewFeedForUser(@Payload() data: GetPostByIdDto) {
    return this.postsService.getPostById(new Types.ObjectId(data.postId));
  }
}
