import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = new DocumentBuilder()
    .setTitle('Post API')
    .setDescription('The Posts API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/', app, document);

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('PORT'));
}
bootstrap();
