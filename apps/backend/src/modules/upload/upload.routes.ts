import { Router } from 'express';
import { UploadController } from './upload.controller';
import { uploadResume } from '../../middleware/fileUpload';
import authMiddleware from '../../middleware/auth';

const router = Router();
const uploadController = new UploadController();

// All upload routes require authentication
router.use(authMiddleware);

// Upload resume file
router.post(
  '/resume',
  uploadResume,
  uploadController.uploadResume.bind(uploadController),
);

// Delete uploaded resume
router.delete(
  '/resume/:filename',
  uploadController.deleteResume.bind(uploadController),
);

export { router as uploadRoutes };
