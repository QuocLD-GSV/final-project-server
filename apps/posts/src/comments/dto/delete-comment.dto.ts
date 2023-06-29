import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteCommentDto {
  @ApiProperty({ description: 'id of the comment want to delete' })
  @IsNotEmpty()
  comment_id: string;
}
