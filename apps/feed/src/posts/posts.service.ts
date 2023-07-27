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
    const dataQuery = await this.postsRepository.getAllInforPostById(postId);

    return {
      ...dataQuery,
      likeCount: dataQuery.likes.length || null,
      commentCount: dataQuery.comments.length || null,
    };
  }

  async getAllLikedUser(postId: Types.ObjectId) {
    return await this.likesRepository.returnAllLike(postId);
  }
}
