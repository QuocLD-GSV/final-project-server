import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
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

  @Prop([
    { refreshToken: String, createdAt: { type: Date, default: Date.now } },
  ])
  authenticate: {
    refreshToken: string;
    createdAt: Date;
  }[];

  @Prop()
  bio: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
