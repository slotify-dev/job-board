import { Router } from 'express';
import { ApplicationsController } from './applications.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';
import {
  validateRequest,
  validateParams,
} from '../../middleware/validationMiddleware';
import { createApplicationSchema, jobParamsSchema } from './applications.types';

const router = Router();
const applicationsController = new ApplicationsController();

router.use(authMiddleware);

// Job application routes (job seeker role required)
router.post(
  '/jobs/:uuid/apply',
  requireRole(['job_seeker']),
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
