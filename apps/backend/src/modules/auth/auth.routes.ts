import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

// Auth routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post(
  '/oauth/callback',
  authController.oauthCallback.bind(authController),
);
router.get('/me', authController.getMe.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export { router as authRoutes };
