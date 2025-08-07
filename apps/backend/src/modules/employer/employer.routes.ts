import { Router } from 'express';
import { EmployerController } from './employer.controller';

const router = Router();
const employerController = new EmployerController();

// Employer job management routes (employer role required)
router.post('/jobs', employerController.createJob.bind(employerController));
router.get('/jobs', employerController.getMyJobs.bind(employerController));
router.put(
  '/jobs/:uuid',
  employerController.updateJob.bind(employerController),
);
router.delete(
  '/jobs/:uuid',
  employerController.deleteJob.bind(employerController),
);

// Employer application management routes (employer role required)
router.get(
  '/jobs/:uuid/applications',
  employerController.getJobApplications.bind(employerController),
);
router.patch(
  '/applications/:uuid',
  employerController.updateApplicationStatus.bind(employerController),
);

export { router as employerRoutes };
