import { service } from '@app/common/constants/services.constants';
import { Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    @Inject(service.POSTS_SERVICE) private postsClient: ClientProxy,
    @Inject(service.AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

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
