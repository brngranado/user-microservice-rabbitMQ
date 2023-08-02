import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PassportModule, UsersService, JwtService],
  exports: [PassportModule, AuthenticationService],
})
export class AuthenticationModule {}
