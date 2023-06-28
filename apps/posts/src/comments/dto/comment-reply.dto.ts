import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentReplyDto {
  @ApiProperty({
    description: 'content or new reply comment ',
    example: 'really, I dont think so',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Id of comment want to reply' })
  @IsNotEmpty()
  parentComment: string;

  @ApiProperty()
  @IsNotEmpty()
  postId: string;
}
