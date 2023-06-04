import { NestFactory } from '@nestjs/core';
import { InteractModule } from './interact.module';

async function bootstrap() {
  const app = await NestFactory.create(InteractModule);
  await app.listen(3000);
}
bootstrap();
