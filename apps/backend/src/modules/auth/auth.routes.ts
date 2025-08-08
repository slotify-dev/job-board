import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import authMiddleware from '../../middleware/auth';
import { registerSchema, loginSchema, oauthCallbackSchema } from './auth.types';
import { authRateLimit } from '../../middleware/rateLimiters';

const router = Router();
const authController = new AuthController();

// Public auth routes with strict rate limiting
router.post(
  '/register',
  authRateLimit,
  validateRequest(registerSchema),
  authController.register.bind(authController),
);

router.post(
  '/login',
  authRateLimit,
  validateRequest(loginSchema),
  authController.login.bind(authController),
);

router.post(
  '/oauth/callback',
  authRateLimit,
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
