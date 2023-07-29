import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { User, UserSchema } from '@app/common/models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
