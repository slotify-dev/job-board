import cors from 'cors';
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

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Rate limiting middleware (applied globally)
  app.use(globalRateLimit);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

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

  return app;
};
