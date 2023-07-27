import { IsNotEmpty } from 'class-validator';

export class GetAllPostCommentsDto {
  @IsNotEmpty()
  postId: string;
}
