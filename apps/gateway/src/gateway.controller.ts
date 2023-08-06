import { JwtAuthGuard } from '@app/common';
import { service } from '@app/common/constants/services.constants';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { User } from '@app/common/models/schemas/user.schema';
import {
  BadGatewayException,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    @Inject(service.POSTS_SERVICE) private postsClient: ClientProxy,
    @Inject(service.AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(service.FEED_SERVICE) private feedClient: ClientProxy,
  ) {}

  @ApiOperation({ description: 'get user detail' })
  @Get('/user-detail/:id')
  async getUserDetails(@Param('id') userId: any) {
    try {
      const userDetail$ = this.authClient.send(
        {
          cmd: 'get-user-details',
        },
        { userId },
      );
      return firstValueFrom(userDetail$);
    } catch (error) {
      return new BadGatewayException('import a id param');
    }
  }

  @ApiOperation({ description: 'get all users' })
  @Get()
  async getHello() {
    const users$ = this.postsClient.send(
      {
        cmd: 'get-users',
      },
      {},
    );
    return firstValueFrom(users$);
  }
}
