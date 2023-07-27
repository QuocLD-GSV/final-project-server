import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from '../repository/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '@app/common/models/schemas/post.schema';
import { Like, LikeSchema } from '@app/common/models/schemas/like.schema';
import { LikesRepository } from '../repository/likes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, LikesRepository],
})
export class PostsModule {}
