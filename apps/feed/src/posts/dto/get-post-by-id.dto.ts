import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetPostByIdDto {
  @ApiProperty({ description: 'post id to get infor' })
  @IsNotEmpty()
  postId: string;
}
