import { Router } from 'express';
import { UploadController } from './upload.controller';
import { uploadResume } from '../../middleware/fileUpload';
import authMiddleware from '../../middleware/auth';

const router = Router();
const uploadController = new UploadController();

// Upload resume file (requires auth)
router.post(
  '/resume',
  authMiddleware,
  uploadResume,
  uploadController.uploadResume.bind(uploadController),
);

// Serve resume file (public access for viewing)
router.get(
  '/resume/:filename',
  uploadController.serveResume.bind(uploadController),
);

// Delete uploaded resume (requires auth)
router.delete(
  '/resume/:filename',
  authMiddleware,
  uploadController.deleteResume.bind(uploadController),
);

export { router as uploadRoutes };
