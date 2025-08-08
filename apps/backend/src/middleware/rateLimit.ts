import { Request, Response, NextFunction } from 'express';
import rateLimitService, {
  TokenBucketConfig,
} from '../services/rateLimitService';
import { env } from '../config/env';

export interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  statusCode?: number;
  headers?: boolean;
  refillRate?: number;
  burstCapacity?: number;
}

const defaultConfig: Required<Omit<RateLimitConfig, 'keyGenerator'>> & {
  keyGenerator?: (req: Request) => string;
} = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  refillRate: env.RATE_LIMIT_MAX_REQUESTS / (env.RATE_LIMIT_WINDOW_MS / 1000),
  burstCapacity: env.RATE_LIMIT_MAX_REQUESTS,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  message: 'Too many requests from this IP, please try again later',
  statusCode: 429,
  headers: true,
};

const createRateLimit = (config: RateLimitConfig = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const key = finalConfig.keyGenerator
        ? finalConfig.keyGenerator(req)
        : `rate_limit:${req.ip}`;

      const bucketConfig: TokenBucketConfig = {
        capacity: finalConfig.burstCapacity,
        refillRate: finalConfig.refillRate,
        windowMs: finalConfig.windowMs,
      };

      const result = await rateLimitService.consumeToken(key, 1, bucketConfig);

      if (finalConfig.headers) {
        res.set({
          'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
          'X-RateLimit-Remaining': Math.max(
            0,
            result.tokensRemaining,
          ).toString(),
          'X-RateLimit-Reset': new Date(
            Date.now() + finalConfig.windowMs,
          ).toISOString(),
        });

        if (result.retryAfter) {
          res.set(
            'Retry-After',
            Math.ceil(result.retryAfter / 1000).toString(),
          );
        }
      }

      if (!result.allowed) {
        res.status(finalConfig.statusCode).json({
          error: finalConfig.message,
          retryAfter: result.retryAfter,
        });
        return;
      }

      if (
        finalConfig.skipSuccessfulRequests ||
        finalConfig.skipFailedRequests
      ) {
        const originalEnd = res.end.bind(res);
        let requestCounted = false;

        res.end = function (...args: Parameters<typeof originalEnd>) {
          if (!requestCounted) {
            const shouldSkip =
              (finalConfig.skipSuccessfulRequests && res.statusCode < 400) ||
              (finalConfig.skipFailedRequests && res.statusCode >= 400);

            if (shouldSkip) {
              rateLimitService
                .returnToken(key, 1, bucketConfig)
                .catch((error) => {
                  console.error('Error returning token:', error);
                });
            }
            requestCounted = true;
          }
          return originalEnd(...args);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next();
    }
  };
};

export default createRateLimit;
