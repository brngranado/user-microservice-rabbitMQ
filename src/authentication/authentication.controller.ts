import { Controller, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ClientProxy,
  Ctx,
  RmqContext,
  MessagePattern,
  Payload
} from '@nestjs/microservices';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  // @UseGuards(AuthGuard('jwt'))
  @MessagePattern('login')
  async login(@Payload() createAuthenticationDto: CreateAuthenticationDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const dataUser = await this.authenticationService.getAuthenticatedUser(createAuthenticationDto.email, createAuthenticationDto.password);
    channel.sendToQueue(
      originalMsg.properties.replyTo,
      Buffer.from(JSON.stringify(dataUser)),
      {
        correlationId: originalMsg.properties.correlationId,
      },
    );

  }

  @MessagePattern('refreshToken')
  async refreshToken(@Payload() refreshTokenDto: RefreshTokenDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const tokenRefreshed = await this.authenticationService.refreshToken(refreshTokenDto.tokenData);
    channel.sendToQueue(
      originalMsg.properties.replyTo,
      Buffer.from(JSON.stringify(tokenRefreshed)),
      {
        correlationId: originalMsg.properties.correlationId,
      },
    );

  }
}
