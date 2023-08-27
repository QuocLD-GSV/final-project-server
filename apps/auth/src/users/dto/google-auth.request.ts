import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  googleId: string;

  avatar: string;
}
