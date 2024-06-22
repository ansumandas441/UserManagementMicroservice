import { CacheModuleAsyncOptions, CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

// export const RedisOptions: CacheModuleAsyncOptions = {
//     isGlobal: true,
//     imports: [ConfigModule],
//     useFactory: async (configService: ConfigService) => {
//       const store = await redisStore({
//         socket: {
//           host: configService.get<string>('REDIS_HOST'),
//           port: parseInt(configService.get<string>('REDIS_PORT')!),
//         },
//       });
//       return {
//         store: () => store,
//       };
//     },
//     inject: [ConfigService],
//   };

export class RedisConfigService implements CacheOptionsFactory {
    constructor(private configService: ConfigService) {}
  
    createCacheOptions(): CacheModuleOptions {
      return {
        // store: redisStore,
        host: this.configService.get<string>('REDIS_HOST', 'redis-19850.c1.asia-northeast1-1.gce.redns.redis-cloud.com'),
        port: this.configService.get<number>('REDIS_PORT', 19850),
        password: this.configService.get<string>('REDIS_PASSWORD', '4DXmCCkcCUrjHPuFiblOAKOQ7HnHsq1p'),
        ttl: 3600, // 1 hour
      };
    }
  }