import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowUserDto {
  @ApiProperty({ description: 'User id to follow' })
  @IsNotEmpty()
  user_id: string;
}
