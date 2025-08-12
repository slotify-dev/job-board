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
import { uploadRoutes } from './modules/upload/upload.routes.js';
import { globalRateLimit } from './middleware/rateLimiters.js';

export const createApp = (): Application => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'", 'https:', 'data:'],
          imgSrc: ["'self'", 'data:'],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(
    cors({
      credentials: true,
      optionsSuccessStatus: 204,
      origin: ['http://localhost:5173'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }),
  );

  // make sure to limit payload
  app.use(express.json({ limit: '5MB' }));
  app.use(express.urlencoded({ extended: true }));

  // TODO: use ssl in prod
  // app.use(sslify.HTTPS());
  app.use(cookieParser());
  app.use(xss()); // Prevents XSS attacks

  // Rate limiting middleware (applied globally)
  app.use(globalRateLimit); // Prevents brute force

  // Logging middleware
  app.use(morgan(isDevelopment ? 'dev' : 'combined'));

  // Serve uploaded files with headers optimized for PDF viewing in iframes
  app.use(
    '/uploads',
    (req, res, next) => {
      // Set headers for PDF files to allow iframe embedding
      if (req.path.includes('.pdf')) {
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
      next();
    },
    express.static('uploads'),
  );

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobsRoutes);
  app.use('/api', applicationsRoutes);
  app.use('/api/employer', employerRoutes);
  app.use('/api/me/profile', profileRoutes);
  app.use('/api/upload', uploadRoutes);

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
