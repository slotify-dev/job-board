import { Router } from 'express';
import { EmployerController } from './employer.controller';
import authMiddleware from '../../middleware/auth';
import requireRole from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import validateParams from '../../middleware/validateParams';
import { jobPostingRateLimit } from '../../middleware/rateLimiters';
import {
  createJobSchema,
  updateJobSchema,
  updateApplicationStatusSchema,
  jobParamsSchema,
  applicationParamsSchema,
} from './employer.types';

const router = Router();
const employerController = new EmployerController();

router.use(authMiddleware);
router.use(requireRole(['employer']));

// Employer job management routes (employer role required)
router.post(
  '/jobs',
  jobPostingRateLimit,
  validateRequest(createJobSchema),
  employerController.createJob.bind(employerController),
);

router.get('/jobs', employerController.getMyJobs.bind(employerController));

router.put(
  '/jobs/:uuid',
  validateParams(jobParamsSchema),
  validateRequest(updateJobSchema),
  employerController.updateJob.bind(employerController),
);

router.delete(
  '/jobs/:uuid',
  validateParams(jobParamsSchema),
  employerController.deleteJob.bind(employerController),
);

// Employer application management routes (employer role required)
router.get(
  '/jobs/:uuid/applications',
  validateParams(jobParamsSchema),
  employerController.getJobApplications.bind(employerController),
);

router.patch(
  '/applications/:uuid',
  validateParams(applicationParamsSchema),
  validateRequest(updateApplicationStatusSchema),
  employerController.updateApplicationStatus.bind(employerController),
);

export { router as employerRoutes };
