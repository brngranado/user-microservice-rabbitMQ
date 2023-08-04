import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UsersService } from '../users.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthUserGuard extends AuthGuard('jwt') implements CanActivate {
  
  constructor(
    private reflector: Reflector,
    private readonly authenticationService: AuthenticationService, 
    private readonly userService: UsersService
    ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const token = this.reflector.getAllAndOverride<string>(
    //   'token',
    //   [context.getHandler(), context.getClass()],
    // );
    //TODO: follow here =)
    const token = context.switchToHttp().getRequest().headers['Authorization']; 
    console.log(token);
    const validate = this.authenticationService.validateToken(token);
    const emailDecoded = validate.email; 
    const passDecoded = validate.password; 

    const user =  await this.userService.getByEmail(emailDecoded);
    const validatedPass = this.authenticationService.validatePassword(passDecoded, user.password);
    const isValid = user && validatedPass ? true : false;
  
    if (isValid === false) {
      throw new UnauthorizedException(); 
    }
    return true;
  }
}
