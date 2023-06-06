import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  googleId: string;

  dateOfBirth: Date;

  avatar: string;

  bio: string;
}
