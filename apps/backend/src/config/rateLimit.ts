import { env } from './env';

export const rateLimitConfig = {
  // Default configuration
  default: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    refillRate: env.RATE_LIMIT_MAX_REQUESTS / (env.RATE_LIMIT_WINDOW_MS / 1000),
    burstCapacity: env.RATE_LIMIT_MAX_REQUESTS,
  },

  // Authentication endpoints - strict limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    refillRate: 5 / (15 * 60), // 5 tokens per 15 minutes
    burstCapacity: 5,
  },

  // API endpoints - moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    refillRate: 100 / 60, // ~1.67 tokens per second
    burstCapacity: 100,
  },

  // Expensive operations - stricter limits
  expensive: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    refillRate: 10 / 60, // ~0.17 tokens per second
    burstCapacity: 10,
  },

  // Per-user limits (authenticated)
  perUser: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 200,
    refillRate: 200 / 60, // ~3.33 tokens per second
    burstCapacity: 200,
  },

  // Job application limits
  jobApplication: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    refillRate: 10 / (60 * 60), // 10 tokens per hour
    burstCapacity: 10,
  },

  // Job posting limits
  jobPosting: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    refillRate: 5 / (60 * 60), // 5 tokens per hour
    burstCapacity: 5,
  },

  // Global rate limiting
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    refillRate: 1000 / (15 * 60), // ~1.11 tokens per second
    burstCapacity: 1000,
  },

  // Common messages
  messages: {
    auth: 'Too many authentication attempts, please try again later',
    api: 'Too many requests from this IP, please try again later',
    expensive: 'Too many expensive operations, please slow down',
    jobApplication:
      'Too many job applications, please wait before applying to more jobs',
    jobPosting: 'Too many job postings, please wait before posting more jobs',
    global: 'Too many requests from this IP address',
  },
};
