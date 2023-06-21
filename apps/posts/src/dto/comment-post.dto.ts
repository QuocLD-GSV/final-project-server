import { IsNotEmpty } from 'class-validator';

export class CreateCommentToPostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  postId: string;
}
