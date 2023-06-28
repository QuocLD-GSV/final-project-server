import { ApiProperty } from '@nestjs/swagger';

export class LikePostDto {
  @ApiProperty({ required: true, type: String })
  post_id: string;
}
