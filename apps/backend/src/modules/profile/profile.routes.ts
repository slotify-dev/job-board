import { Router } from 'express';
import { ProfileController } from './profile.controller';

const router = Router();
const profileController = new ProfileController();

// Profile routes (authenticated users only)
router.get('/', profileController.getProfile.bind(profileController));
router.put('/', profileController.updateProfile.bind(profileController));

export { router as profileRoutes };
