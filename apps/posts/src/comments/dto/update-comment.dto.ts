import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'id comment to update' })
  @IsNotEmpty()
  comment_id: string;

  @ApiProperty()
  content: string;
}
