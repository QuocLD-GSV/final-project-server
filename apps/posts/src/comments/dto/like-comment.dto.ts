import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikeCommentDto {
  @ApiProperty({ description: 'comment id to like or unlike' })
  @IsNotEmpty()
  comment_id: string;
}
