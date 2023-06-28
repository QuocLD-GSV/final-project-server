import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostsModule } from './posts.module';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);

  const config = new DocumentBuilder()
    .setTitle('Post API')
    .setDescription('The Posts API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/posts', app, document);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('POST', true));
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
