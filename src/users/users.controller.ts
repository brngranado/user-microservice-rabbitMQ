import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserGuard } from './authuser/authuser.guard';
import { UserDecorator } from './authuser/user-decorator.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users_event')
  handleUsersEvent(@Payload() data: any[], @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // console.log('ID QUE ENVIA EL CLIENTE', data['user_id']);
    channel.sendToQueue(
      originalMsg.properties.replyTo,
      Buffer.from(
        JSON.stringify({
          name: 'Bryan Granado',
          ci: '12345678',
          phone: '12345678',
        }),
      ),
      {
        correlationId: originalMsg.properties.correlationId,
      },
    );
  }


  @UseGuards(AuthUserGuard)
  @MessagePattern('find_users')
  findAll(@Payload() data: any[], @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const usersTotals = this.usersService.findAll();
    channel.sendToQueue(
      originalMsg.properties.replyTo,
      Buffer.from(JSON.stringify(usersTotals)),
      {
        correlationId: originalMsg.properties.correlationId,
      },
    );
  }

  

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
