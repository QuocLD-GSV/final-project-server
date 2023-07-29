import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '@app/common/models/schemas/post.schema';
import { Like, LikeSchema } from '@app/common/models/schemas/like.schema';
import { PostsRepository } from '@app/common/repositories/posts.repository';
import { LikesRepository } from '@app/common/repositories/likes.repository';

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
