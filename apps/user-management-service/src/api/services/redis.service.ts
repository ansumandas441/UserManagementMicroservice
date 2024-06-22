import { env } from 'process';
import { createClient } from 'redis';


export const redisClient = createClient({ url: env.REDIS_URL});