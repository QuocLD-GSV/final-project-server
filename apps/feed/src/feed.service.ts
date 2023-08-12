import { PostsRepository } from '@app/common/repositories/posts.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {
  getHello(): string {
    return 'Hello World!';
  }
}
