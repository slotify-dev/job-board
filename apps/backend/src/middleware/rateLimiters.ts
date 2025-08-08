import createRateLimit from './rateLimit';
import { rateLimitConfig } from '../config/rateLimit';

// Predefined rate limiters for common use cases
export const authRateLimit = createRateLimit({
  ...rateLimitConfig.auth,
  keyGenerator: (req) => `auth_limit:${req.ip}`,
  message: rateLimitConfig.messages.auth,
});

export const apiRateLimit = createRateLimit({
  ...rateLimitConfig.api,
  keyGenerator: (req) => `api_limit:${req.ip}`,
  message: rateLimitConfig.messages.api,
});

export const expensiveRateLimit = createRateLimit({
  ...rateLimitConfig.expensive,
  keyGenerator: (req) => `expensive_limit:${req.ip}`,
  message: rateLimitConfig.messages.expensive,
});

export const perUserRateLimit = (userId: string) =>
  createRateLimit({
    ...rateLimitConfig.perUser,
    keyGenerator: () => `user_limit:${userId}`,
  });

export const jobApplicationRateLimit = createRateLimit({
  ...rateLimitConfig.jobApplication,
  keyGenerator: (req) => `job_app_limit:${req.user?.id || req.ip}`,
  message: rateLimitConfig.messages.jobApplication,
});

export const jobPostingRateLimit = createRateLimit({
  ...rateLimitConfig.jobPosting,
  keyGenerator: (req) => `job_post_limit:${req.user?.id || req.ip}`,
  message: rateLimitConfig.messages.jobPosting,
});

export const globalRateLimit = createRateLimit({
  ...rateLimitConfig.global,
  keyGenerator: (req) => `global_limit:${req.ip}`,
  message: rateLimitConfig.messages.global,
});
