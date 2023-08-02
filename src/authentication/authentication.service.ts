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
  create(createAuthenticationDto: CreateAuthenticationDto) {
    return 'This action adds a new authentication';
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
