import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectHTTPExceptions } from './decorators/try-catch';
import { CreatePostDto } from './dto/create-new-post.dto';
import { PostErrors } from './errors/posts.errors';
import { PostsRepository } from './repository/posts.repository';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostsRepository) {}

  getAll() {
    return this.postRepository.find({});
  }

  @InjectHTTPExceptions(
    PostErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createPost(data: any) {
    return this.postRepository.create({
      ...data,
      user_id: data.user_id,
      isDeleted: false,
    });
  }

  @InjectHTTPExceptions(
    PostErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
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
