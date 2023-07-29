import { AuthGuard } from '@nestjs/passport';

export default class LocalJwtAuthGuard extends AuthGuard('local-jwt') {
  constructor() {
    super();
  }
}
