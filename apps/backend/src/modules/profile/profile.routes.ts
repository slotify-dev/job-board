import { Router } from 'express';
import { ProfileController } from './profile.controller';
import authMiddleware from '../../middleware/auth';

const router = Router();
const profileController = new ProfileController();

router.use(authMiddleware);

// Profile routes (authenticated users only)
router.get('/', profileController.getProfile.bind(profileController));
router.put('/', profileController.updateProfile.bind(profileController));

export { router as profileRoutes };
