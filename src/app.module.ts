import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {AuthenticationModule} from './authentication/authentication.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UsersModule,
      AuthenticationModule
    ]
})
export class AppModule {}