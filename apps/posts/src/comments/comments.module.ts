import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from '@app/common';
import { LikesRepository } from '../repository/likes.repository';
import { CommentsRepository } from './repositorys/comments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '../schemas/like.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsRepository } from '../repository/posts.repository';

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
