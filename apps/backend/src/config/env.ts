import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  API_VERSION: z.string().default('v1'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  // Redis Configuration
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  // Rate Limiting Configuration
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('60000'), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('100'),
});

type Environment = z.infer<typeof envSchema>;

const parseEnv = (): Environment => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors);
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
export const isDevelopment = env.NODE_ENV === 'development';
