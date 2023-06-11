import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreatePostDto } from '../dto/create-new-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostsRepository) {}

  getAll() {
    return this.postRepository.find({});
  }

  async createPost(data: any) {
    return this.postRepository.create({
      ...data,
      user_id: data.user_id,
      isDeleted: false,
    });
  }

  async likePost(post_id: Types.ObjectId, user_id: Types.ObjectId) {
    return this.postRepository.findOneAndUpdate(
      { _id: post_id },
      {
        $addToSet: {
          likeId: user_id,
        },
      },
    );
  }
}
