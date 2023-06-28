import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsRepository } from './repository/posts.repository';
import { PostsService } from './posts.service';
import { LikesRepository } from './repository/likes.repository';
import { Like, LikeSchema } from './schemas/like.schema';
import { Comment, CommentSchema } from './comments/schemas/comment.schema';
import { User, UserSchema } from './schemas/user.schema';
import { CommentsModule } from './comments/comments.module';
import { CommentsRepository } from './comments/repositorys/comments.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/posts/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    RmqModule,
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    LikesRepository,
    PostsRepository,
    CommentsRepository,
  ],
})
export class PostsModule {}
