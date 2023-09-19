import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetPostByIdDto } from './dto/get-post-by-id.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ description: 'return all post information' })
  @Get('get-post')
  getPostById(@Query('postId') postId: string) {
    return this.postsService.getPostById(new Types.ObjectId(postId));
  }

  @Get('all-post-likes')
  getAllLikeUser(@Payload() data: GetPostByIdDto) {
    return this.postsService.getAllLikedUser(new Types.ObjectId(data.postId));
  }

  @Get('public-posts')
  getNewFeedForUser(@Query('page') page: number, @Query('size') size: number) {
    return this.postsService.getPublicPostsPaginate(page, size);
  }

  @Get("profile-posts")
  getUserPost(@Query('userd') userId: string){
    return this.postsService.getProfileUserPost(new Types.ObjectId(String(userId)));
  }
}
