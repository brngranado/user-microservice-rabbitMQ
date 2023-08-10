import { SetMetadata } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

export const UserDecorator = (context: RmqContext) => SetMetadata('userDecorator', context);
