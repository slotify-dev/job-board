import cors from 'cors';
import xss from 'xss-clean';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

import type { Application } from 'express';
import { isDevelopment } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { jobsRoutes } from './modules/jobs/jobs.routes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { profileRoutes } from './modules/profile/profile.routes.js';
import { employerRoutes } from './modules/employer/employer.routes.js';
import { applicationsRoutes } from './modules/applications/applications.routes.js';
import { globalRateLimit } from './middleware/rateLimiters.js';

export const createApp = (): Application => {
  const app = express();

  app.use(
    helmet({
      noSniff: true,
      xssFilter: true,
      frameguard: { action: 'deny' },
      dnsPrefetchControl: { allow: false },
      referrerPolicy: { policy: 'no-referrer' },
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      contentSecurityPolicy: {
        directives: {
          objectSrc: ['none'],
          defaultSrc: ['self'],
          upgradeInsecureRequests: [],
          scriptSrc: ['self', 'unsafe-inline'],
        },
      },
    }),
  );

  app.use(
    cors({
      credentials: true,
      optionsSuccessStatus: 204,
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // make sure to limit payload
  app.use(express.json({ limit: '1MB' }));
  app.use(express.urlencoded({ extended: true }));

  // TODO: use ssl in prod
  // app.use(sslify.HTTPS());
  app.use(cookieParser());
  app.use(xss()); // Prevents XSS attacks

  // Rate limiting middleware (applied globally)
  app.use(globalRateLimit); // Prevents brute force

  // Logging middleware
  app.use(morgan(isDevelopment ? 'dev' : 'combined'));

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobsRoutes);
  app.use('/api', applicationsRoutes);
  app.use('/api/employer', employerRoutes);
  app.use('/api/me/profile', profileRoutes);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      remaining: 0,
      accepted: false,
      error: 'Not found',
    });
  });

  return app;
};
