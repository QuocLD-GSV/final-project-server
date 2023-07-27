import { Controller, Get } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetPostByIdDto } from './dto/get-post-by-id.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ description: 'return all post information' })
  @Get('get-post')
  getNewFeedForUser(@Payload() data: GetPostByIdDto) {
    return this.postsService.getPostById(new Types.ObjectId(data.postId));
  }

  @Get('all-post-likes')
  getAllLikeUser(@Payload() data: GetPostByIdDto) {
    return this.postsService.getAllLikedUser(new Types.ObjectId(data.postId));
  }
}
