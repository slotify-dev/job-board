import { Router } from 'express';
import { ApplicationsController } from './applications.controller';
import authMiddleware from '../../middleware/auth';
import requireRole from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import validateParams from '../../middleware/validateParams';
import { createApplicationSchema, jobParamsSchema } from './applications.types';
import { jobApplicationRateLimit } from '../../middleware/rateLimiters';
import { uploadResume } from '../../middleware/fileUpload';

const router = Router();
const applicationsController = new ApplicationsController();

router.use(authMiddleware);

// Job application routes (job seeker role required)
router.post(
  '/jobs/:uuid/apply',
  requireRole(['job_seeker']),
  jobApplicationRateLimit,
  validateParams(jobParamsSchema),
  uploadResume, // Handle file upload first
  // Custom validation that checks for either file or URL
  (req, res, next) => {
    if (!req.file && !req.body.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Either resume file upload or resume URL is required',
      });
    }
    next();
  },
  validateRequest(createApplicationSchema),
  applicationsController.applyToJob.bind(applicationsController),
);

router.get(
  '/me/applications',
  requireRole(['job_seeker']),
  applicationsController.getMyApplications.bind(applicationsController),
);

export { router as applicationsRoutes };
