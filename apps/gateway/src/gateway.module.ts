import { RmqModule } from '@app/common';
import { service } from '@app/common/constants/services.constants';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/gateway/.env',
    }),
    RmqModule.register({
      name: service.POSTS_SERVICE,
    }),
    RmqModule.register({
      name: service.AUTH_SERVICE,
    }),
    RmqModule.register({
      name: service.FEED_SERVICE,
    }),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
