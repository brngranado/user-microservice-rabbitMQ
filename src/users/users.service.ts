import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return  [
      {
      name: 'Bryan Granado',
      ci: '12345678',
      phone: '12345678',
     },
     {
      name: 'José Rodríguez',
      ci: '123456789',
      phone: '1234567834',
     },
     {
      name: 'Juan Pérez',
      ci: '123456734',
      phone: '1234567812',
     },
     {
      name: 'Irina GUilarte',
      ci: '14534453',
      phone: '3444347812',
     }
  ];
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
