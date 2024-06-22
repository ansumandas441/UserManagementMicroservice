// test-redis.ts
import { Cache } from 'cache-manager';
import * as cacheManager from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';

async function testRedis() {
  const cache: Cache = cacheManager.caching({
    store: redisStore,
    host: 'redis-19850.c1.asia-northeast1-1.gce.redns.redis-cloud.com',
    port: 19850,
    password: '4DXmCCkcCUrjHPuFiblOAKOQ7HnHsq1p',
    ttl: 60,
  });

  await cache.set('test_key', 'test_value');
  const value = await cache.get<string>('test_key');
  console.log('Cached Value:', value);
}

testRedis();
