import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsRepository } from '../repository/posts.repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async getPostById(postId: Types.ObjectId) {
    return this.postsRepository.getAllInforPostById(postId);
  }
}
