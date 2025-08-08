import { Router } from 'express';
import { JobsController } from './jobs.controller';
import {
  validateQuery,
  validateParams,
} from '../../middleware/validationMiddleware';
import { jobListQuerySchema, jobParamsSchema } from './jobs.types';

const router = Router();
const jobsController = new JobsController();

// Public job routes
router.get(
  '/',
  validateQuery(jobListQuerySchema),
  jobsController.getJobs.bind(jobsController),
);

router.get(
  '/:uuid',
  validateParams(jobParamsSchema),
  jobsController.getJobById.bind(jobsController),
);

export { router as jobsRoutes };
