import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  likeId: {}[];

  media: {
    type: string;
    url: string;
  }[];

  location: {
    latitude: number;
    longitude: number;
  };
}
