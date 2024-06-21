import { env } from 'process';
import { createClient } from 'redis';


const client = createClient({
    password: env.REDIS_PASWORD,
    socket: {
        host: env.REDIS_URL,
        port: 19850
    }
});
const connectRedis = async () => {
    return client.connect().then(() => {
      console.log('Connected to Redis');
    }).catch((err) => {
      console.error('Error connecting to Redis:', err);
    });
  };

export default connectRedis;