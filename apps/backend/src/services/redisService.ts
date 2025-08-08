import { createClient, RedisClientType } from 'redis';
import { redisConfig } from '../config/redis';

class RedisService {
  private client: RedisClientType;
  private static instance: RedisService;

  private constructor() {
    this.client = createClient(redisConfig);

    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis Client Reconnecting');
    });

    this.client.on('ready', () => {
      console.log('Redis Client Ready');
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect from Redis:', error);
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  // Generic Redis operations
  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  public async set(
    key: string,
    value: string,
    options?: { EX?: number; PX?: number },
  ): Promise<void> {
    try {
      if (options) {
        await this.client.set(key, value, options);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  public async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      throw error;
    }
  }

  public async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      throw error;
    }
  }

  // Health check
  public async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis PING error:', error);
      return false;
    }
  }
}

const redisService = RedisService.getInstance();
export default redisService;
