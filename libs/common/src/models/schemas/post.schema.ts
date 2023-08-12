import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Schema as MongooseShema } from 'mongoose';
import { Like } from './like.schema';
import { User } from './user.schema';

@Schema({ timestamps: true, collection: 'posts' })
export class Post extends AbstractDocument {
  @Prop({ type: String, required: true, ref: 'User' })
  user_id: User;

  @Prop({ type: String, required: true })
  content: string;

  @Prop([
    {
      type: MongooseShema.Types.ObjectId,
      ref: 'Like',
      required: false,
    },
  ])
  likes: Like[];

  @Prop([
    {
      type: MongooseShema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
  ])
  comments: Comment[];

  @Prop([
    {
      type: {
        type: String,
        enum: ['image', 'video'],
      },
      url: String,
      key: String,
    },
    { required: false },
  ])
  media: {
    type: string;
    url: string;
    key: string;
  }[];

  @Prop([
    {
      type: MongooseShema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ])
  user_tag: User[];

  @Prop({
    type: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    required: false,
  })
  location: {
    latitude: number;
    longitude: number;
  };

  @Prop({ type: Boolean, default: true })
  public: boolean;

  @Prop({ type: Boolean, default: false })
  published: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
