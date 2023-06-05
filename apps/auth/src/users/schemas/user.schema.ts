import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Types } from 'mongoose';

@Schema({ collection: 'user' })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  googleId: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  avatar: string;

  @Prop({ type: [String], enum: ['user', 'admin'], default: ['user'] })
  roles: string[];

  @Prop([{ refreshToken: String }])
  authenticate: {
    refreshToken: string;
  }[];

  @Prop()
  bio: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
