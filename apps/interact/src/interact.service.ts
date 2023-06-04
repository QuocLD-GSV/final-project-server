import { Injectable } from '@nestjs/common';

@Injectable()
export class InteractService {
  getHello(): string {
    return 'Hello World!';
  }
}
