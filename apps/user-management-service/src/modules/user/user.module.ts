import { Module } from '@nestjs/common';
import { UserServiceImpl } from '../../api/services/user.services.impl';
import { PrismaService } from '../../api/services/prisma.service';
import { UserService } from '../../api/interfaces/user-services.interfaces';
import { UserController } from '../../api/controllers/user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
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
