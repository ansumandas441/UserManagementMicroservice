// redis.module.ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { env } from 'process';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = createClient({ url: env.REDIS_URL });
        client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}