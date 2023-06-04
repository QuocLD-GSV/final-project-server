import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-new-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostsRepository) {}

  getAll() {
    return this.postRepository.find({});
  }

  async createPost(data: CreatePostDto) {
    return this.postRepository.create({
      ...data,
      user_id: '1',
      isDeleted: false,
    });
  }
}
