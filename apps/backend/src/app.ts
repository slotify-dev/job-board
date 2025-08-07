import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Application } from 'express';
import { isDevelopment } from './config/env.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { jobsRoutes } from './modules/jobs/jobs.routes.js';
import { profileRoutes } from './modules/profile/profile.routes.js';
import { employerRoutes } from './modules/employer/employer.routes.js';
import { applicationsRoutes } from './modules/applications/applications.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
  app.use(errorHandler);

  return app;
};
