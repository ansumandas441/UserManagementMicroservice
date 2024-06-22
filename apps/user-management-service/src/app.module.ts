// app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UserModule,
    PrismaModule,
    RedisModule,
  ], 
  providers: [],
})
export class AppModule {}
