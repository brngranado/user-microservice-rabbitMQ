import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {

  constructor(private readonly userService: UsersService, private jwtService: JwtService) {}

  async getAuthenticatedUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    const validatedPass = await this.validatePassword(password, user.password);
    const payload = { username: user.email, password: user.password };

    if (validatedPass === false) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
    const secret = 'mysecret';
    const token = this.sign(payload, secret);
    return {
      user: user.email,
      access_token: token
    }

  }
  validateToken(token: string) {
    const secret = 'mysecret';
    return this.jwtService.verify(token, {secret: secret});
  }

  //TODO: TO OPTIMIZE

  async refreshToken(tokenData: string): Promise<any> {
    const secret = 'mysecret';
    const decoded = this.jwtService.verify(tokenData, {secret: secret});

    // Get user id from decoded token 
    const emailDecoded = decoded.email; 
    const passDecoded = decoded.password; 

    const user = await this.userService.getByEmail(emailDecoded);
    const validatedPass = await this.validatePassword(passDecoded, user.password);

    if (validatedPass === false) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
    const payload = { username: user.email, password: user.password };
    const newTokenRefreshed = this.sign(payload, secret);
    return {
      refreshToken: newTokenRefreshed,
    }
  }

  async validatePassword(password: string, hashedPassword: string) {

      /** Change when the password is hashed and exist in database */
      // const passwordMatched = await bcrypt.compare(
      //     password,
      //     hashedPassword,
      // );
      if (String(hashedPassword) !== String(password)) {
          throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      }
      return true;
  }

  sign(payload: any, secret : string) {
    return this.jwtService.sign(payload, {
      secret: secret,
    });
  }
}
