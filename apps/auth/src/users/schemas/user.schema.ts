import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema()
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

  @Prop()
  bio: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
