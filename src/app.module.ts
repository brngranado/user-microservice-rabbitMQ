import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';

import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UsersModule,
    ]
})
export class AppModule {}