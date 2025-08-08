import { env } from './env';

export const redisConfig = {
  socket: {
    host: env.REDIS_HOST,
    connectTimeout: 10000,
    port: Number(env.REDIS_PORT),
  },
  password: env.REDIS_PASSWORD,
  reconnectStrategy: (retries: number) => {
    const delay = Math.min(retries * 50, 2000);
    return delay;
  },
};
