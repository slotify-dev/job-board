import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validation';
import { authMiddleware } from '../../middleware/authHandler';
import { registerSchema, loginSchema, oauthCallbackSchema } from './auth.types';

const router = Router();
const authController = new AuthController();

// Public auth routes
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register.bind(authController),
);

router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login.bind(authController),
);

router.post(
  '/oauth/callback',
  validateRequest(oauthCallbackSchema),
  authController.oauthCallback.bind(authController),
);

// Protected auth routes
router.get('/me', authMiddleware, authController.getMe.bind(authController));
router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController),
);

export { router as authRoutes };
