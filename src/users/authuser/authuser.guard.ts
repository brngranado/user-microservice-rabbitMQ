import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UsersService } from '../users.service';
import { Reflector } from '@nestjs/core';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
@Injectable()
export class AuthUserGuard extends AuthGuard('jwt') implements CanActivate {
  
  constructor(
    private reflector: Reflector,
    private readonly authenticationService: AuthenticationService, 
    private readonly userService: UsersService,
    ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const rmqContext = rpcContext.getContext<RmqContext>();
    const message = rmqContext.getMessage();
    const headers = message.properties.headers;

    console.log('en el guard', headers);
    // const authHeader = ctx.getContext().headers['authorization'];
    //TODO: follow here =)
    // const token = context.switchToHttp().getRequest().headers['Authorization']; 

    // console.log('TOKEN HEADER',authHeader);
    // const validate = this.authenticationService.validateToken(req);
    // const emailDecoded = validate.email; 
    // const passDecoded = validate.password; 

    // const user =  await this.userService.getByEmail(emailDecoded);
    // const validatedPass = this.authenticationService.validatePassword(passDecoded, user.password);
    // const isValid = user && validatedPass ? true : false;
  
    // if (isValid === false) {
    //   throw new UnauthorizedException(); 
    // }
    return false;
  }
}
