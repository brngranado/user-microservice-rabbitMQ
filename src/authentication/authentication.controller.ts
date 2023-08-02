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

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('createAuthentication')
  create(@Payload() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.create(createAuthenticationDto);
  }

  //TODO: test with postman microservices

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


  @MessagePattern('findAllAuthentication')
  findAll() {
    return this.authenticationService.findAll();
  }

  @MessagePattern('findOneAuthentication')
  findOne(@Payload() id: number) {
    return this.authenticationService.findOne(id);
  }

  @MessagePattern('updateAuthentication')
  update(@Payload() updateAuthenticationDto: UpdateAuthenticationDto) {
    return this.authenticationService.update(updateAuthenticationDto.id, updateAuthenticationDto);
  }

  @MessagePattern('removeAuthentication')
  remove(@Payload() id: number) {
    return this.authenticationService.remove(id);
  }
}
