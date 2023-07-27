import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LikesRepository } from '../repository/likes.repository';
import { PostsRepository } from '../repository/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikesRepository,
  ) {}

  async getPostById(postId: Types.ObjectId) {
    return this.postsRepository.getAllInforPostById(postId);
  }

  async getAllLikedUser(postId: Types.ObjectId) {
    return await this.likesRepository.returnAllLike(postId);
  }
}
