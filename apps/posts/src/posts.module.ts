import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommentsModule } from './comments/comments.module';
import { User, UserSchema } from '@app/common/models/schemas/user.schema';
import { Like, LikeSchema } from '@app/common/models/schemas/like.schema';
import { Post, PostSchema } from '@app/common/models/schemas/post.schema';
import { LikesRepository } from '@app/common/repositories/likes.repository';
import { PostsRepository } from '@app/common/repositories/posts.repository';
import {
  CommentSchema,
  Comment,
} from '@app/common/models/schemas/comment.schema';
import { CommentsRepository } from '@app/common/repositories/comments.repository';
import { service } from '@app/common/constants/services.constants';

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
    RmqModule.register({
      name: service.AUTH_SERVICE,
    }),
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
