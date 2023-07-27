import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseShema, now } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, collection: 'comments' })
export class Comment extends AbstractDocument {
  @Prop({ type: MongooseShema.Types.ObjectId, ref: 'User', required: true })
  author_id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop([{ type: MongooseShema.Types.ObjectId, required: false }])
  like_id: string[];

  @Prop([
    { type: MongooseShema.Types.ObjectId, required: false, ref: 'Comment' },
  ])
  replies: Comment[];

  @Prop({ type: MongooseShema.Types.ObjectId, required: false, ref: 'Comment' })
  parentComment: Comment;

  @Prop({ type: Date, default: now })
  createdAt: Date;

  @Prop({ type: Date, default: now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
