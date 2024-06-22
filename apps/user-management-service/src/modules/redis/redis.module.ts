// redis.module.ts
import { Global, Module, DynamicModule } from '@nestjs/common';
import { createClient } from 'redis';
import { env } from 'process';

// const redisClient = createClient({ url: env.REDIS_URL });

// @Global()
// @Module({})
// export class RedisModule {
//   static async register(): Promise<DynamicModule> {
//     await redisClient.connect();
//     return {
//       module: RedisModule,
//       providers: [
//         {
//           provide: 'REDIS_CLIENT',
//           useValue: redisClient,
//         },
//       ],
//       exports: ['REDIS_CLIENT'],
//     };
//   }
// }


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