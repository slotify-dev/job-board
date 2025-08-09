import { env } from './env';

export const rateLimitConfig = {
  // Default configuration
  default: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    burstCapacity: env.RATE_LIMIT_MAX_REQUESTS,
    refillRate: env.RATE_LIMIT_MAX_REQUESTS / (env.RATE_LIMIT_WINDOW_MS / 1000),
  },

  // Authentication endpoints - strict limits
  auth: {
    maxRequests: 5,
    burstCapacity: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    refillRate: 5 / (15 * 60), // 5 tokens per 15 minutes
  },

  // API endpoints - moderate limits
  api: {
    maxRequests: 100,
    burstCapacity: 100,
    windowMs: 60 * 1000, // 1 minute
    refillRate: 100 / 60, // ~1.67 tokens per second
  },

  // Expensive operations - stricter limits
  expensive: {
    maxRequests: 10,
    burstCapacity: 10,
    windowMs: 60 * 1000, // 1 minute
    refillRate: 10 / 60, // ~0.17 tokens per second
  },

  // Per-user limits (authenticated)
  perUser: {
    maxRequests: 200,
    burstCapacity: 200,
    windowMs: 60 * 1000, // 1 minute
    refillRate: 200 / 60, // ~3.33 tokens per second
  },

  // Job application limits
  jobApplication: {
    maxRequests: 10,
    burstCapacity: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    refillRate: 10 / (60 * 60), // 10 tokens per hour
  },

  // Job posting limits
  jobPosting: {
    maxRequests: 5,
    burstCapacity: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    refillRate: 5 / (60 * 60), // 5 tokens per hour
  },

  // Global rate limiting
  global: {
    maxRequests: 1000,
    burstCapacity: 1000,
    windowMs: 15 * 60 * 1000, // 15 minutes
    refillRate: 1000 / (15 * 60), // ~1.11 tokens per second
  },

  // Common messages
  messages: {
    global: 'Too many requests from this IP address',
    expensive: 'Too many expensive operations, please slow down',
    api: 'Too many requests from this IP, please try again later',
    auth: 'Too many authentication attempts, please try again later',
    jobApplication:
      'Too many job applications, please wait before applying to more jobs',
    jobPosting: 'Too many job postings, please wait before posting more jobs',
  },
};
