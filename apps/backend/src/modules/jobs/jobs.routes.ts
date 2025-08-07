import { Router } from 'express';
import { JobsController } from './jobs.controller';

const router = Router();
const jobsController = new JobsController();

// Public job routes
router.get('/', jobsController.getJobs.bind(jobsController));
router.get('/:uuid', jobsController.getJobById.bind(jobsController));

export { router as jobsRoutes };
