import { Router } from 'express';
import { ApplicationsController } from './applications.controller';
import authMiddleware from '../../middleware/auth';
import requireRole from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import validateParams from '../../middleware/validateParams';
import { createApplicationSchema, jobParamsSchema } from './applications.types';
import { jobApplicationRateLimit } from '../../middleware/rateLimiters';

const router = Router();
const applicationsController = new ApplicationsController();

router.use(authMiddleware);

// Job application routes (job seeker role required)
router.post(
  '/jobs/:uuid/apply',
  requireRole(['job_seeker']),
  jobApplicationRateLimit,
  validateParams(jobParamsSchema),
  validateRequest(createApplicationSchema),
  applicationsController.applyToJob.bind(applicationsController),
);

router.get(
  '/me/applications',
  requireRole(['job_seeker']),
  applicationsController.getMyApplications.bind(applicationsController),
);

export { router as applicationsRoutes };
