import { JwtAuthGuard } from '@app/common';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CreatePostDto } from '../dto/create-new-post.dto';
import { LikePostDto } from '../dto/like-post.dto';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getHello() {
    return this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Payload() data: CreatePostDto, @Req() request: any) {
    console.log(request.user);
    return this.postsService.createPost({
      ...data,
      user_id: request.user._id,
    });
  }

  @Post()
  async like(@Payload() data: LikePostDto) {
    return this.postsService.likePost();
  }
}
