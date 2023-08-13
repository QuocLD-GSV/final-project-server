import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'content of new post',
    example: 'New Post Content',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  location: {
    latitude: number;
    longitude: number;
  };

  @ApiProperty()
  avatar: string;

  @ApiProperty({ description: 'list of id user tag' })
  users_tag: string[];
}
