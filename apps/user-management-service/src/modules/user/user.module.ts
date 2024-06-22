import { Module } from '@nestjs/common';
import { UserServiceImpl } from '../../api/services/user.services.impl';
import { UserService } from '../../api/interfaces/user-services.interfaces';
import { UserController } from '../../api/controllers/user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports:[PrismaModule, RedisModule],
  controllers: [UserController],
  providers: [ 
    {
      provide: UserService,
      useClass: UserServiceImpl,
    }
  ],  
  exports: [UserService],
})
export class UserModule {}
