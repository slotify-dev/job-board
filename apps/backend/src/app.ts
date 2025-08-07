import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Application } from 'express';
import { isDevelopment } from './config/env.js';
import { healthRoutes } from './modules/health/health.routes.js';
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

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};
