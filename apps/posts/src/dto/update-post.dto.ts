import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  post_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  location: {
    latitude: number;
    longitude: number;
  };

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  users_tag: string[];
}
