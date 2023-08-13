import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FeedModule } from './feed.module';

async function bootstrap() {
  const app = await NestFactory.create(FeedModule);
  app.enableCors({});

  const config = new DocumentBuilder()
    .setTitle('Feed API')
    .setDescription('The Authenticate API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/feed', app, document);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('FEED', true));

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
