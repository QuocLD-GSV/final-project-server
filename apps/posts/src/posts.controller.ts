import { JwtAuthGuard } from '@app/common';
import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { CreatePostDto } from './dto/create-new-post.dto';
import { LikePostDto } from './dto/like-post.dto';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { filesUploadLimit } from './constants/constants';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getHello() {
    return this.postsService.getAll();
  }

  @ApiOperation({ description: 'Create new post' })
  @ApiCreatedResponse({ description: 'Return new post' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files[]', filesUploadLimit))
  @Post()
  async createPost(
    @Payload() data: CreatePostDto,
    @Req() request: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.postsService.createPost(
      data,
      new Types.ObjectId(request.user._id),
      files,
    );
  }

  @ApiOperation({ description: 'Like or unlike to a post' })
  @UseGuards(JwtAuthGuard)
  @Post('like')
  async like(@Payload() data: LikePostDto, @Req() request: any) {
    return this.postsService.likePost(
      new Types.ObjectId(data.post_id),
      request.user._id,
    );
  }
}
