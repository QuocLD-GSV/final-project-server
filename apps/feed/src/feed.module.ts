import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '@app/common/models/schemas/post.schema';
import { User, UserSchema } from '@app/common/models/schemas/user.schema';
import {
  Comment,
  CommentSchema,
} from '@app/common/models/schemas/comment.schema';
import { Like, LikeSchema } from '@app/common/models/schemas/like.schema';
import { PostsRepository } from '@app/common/repositories/posts.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/feed/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    AuthModule,
    RmqModule,
    PostsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [FeedController],
  providers: [FeedService, PostsRepository],
})
export class FeedModule {}
