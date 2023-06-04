import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CreatePostDto } from '../dto/create-new-post.dto';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getHello() {
    return this.postsService.getAll();
  }

  @Post()
  async createPost(@Payload() data: CreatePostDto, @Req() request: any) {
    return this.postsService.createPost(data);
  }
}
