import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comment,
  CommentSchema,
} from '@app/common/models/schemas/comment.schema';
import { CommentsRepository } from '@app/common/repositories/comments.repository';
import { UsersRepository } from '@app/common/repositories/users.repository';
import { User, UserSchema } from '@app/common/models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, UsersRepository],
})
export class CommentsModule {}
