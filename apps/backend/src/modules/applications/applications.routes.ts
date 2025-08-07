import { Router } from 'express';
import { ApplicationsController } from './applications.controller';

const router = Router();
const applicationsController = new ApplicationsController();

// Job application routes (job seeker role required)
router.post(
  '/jobs/:uuid/apply',
  applicationsController.applyToJob.bind(applicationsController),
);
router.get(
  '/me/applications',
  applicationsController.getMyApplications.bind(applicationsController),
);

export { router as applicationsRoutes };
