import { Controller, Get } from '@nestjs/common';

@Controller()
export class GatewayController {
  constructor(s) {}

  @Get()
  getHello(): string {
    return;
  }
}
