import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  likeId: {
    user_id: string;
  }[];

  media: {
    type: string;
    url: string;
  }[];

  location: {
    latitude: number;
    longitude: number;
  };
}
