import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '@app/common/models/schemas/like.schema';
import { Post, PostSchema } from '@app/common/models/schemas/post.schema';
import { LikesRepository } from '@app/common/repositories/likes.repository';
import { PostsRepository } from '@app/common/repositories/posts.repository';
import {
  CommentSchema,
  Comment,
} from '@app/common/models/schemas/comment.schema';
import { CommentsRepository } from '@app/common/repositories/comments.repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    LikesRepository,
    CommentsRepository,
    PostsRepository,
  ],
})
export class CommentsModule {}
