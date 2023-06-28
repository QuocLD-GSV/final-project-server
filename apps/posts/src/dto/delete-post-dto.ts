import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeletePostDto {
  @ApiProperty({ description: 'Id Of the post to be delete' })
  @IsNotEmpty()
  post_id: string;
}
