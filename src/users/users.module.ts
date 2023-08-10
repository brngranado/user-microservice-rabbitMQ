import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthUserGuard } from './authuser/authuser.guard';

@Module({
  imports: [
    AuthenticationModule,
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [AuthUserGuard, UsersService],
})
export class UsersModule {}
