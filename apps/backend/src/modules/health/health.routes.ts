import { Router } from 'express';
import { HealthController } from './health.controller.js';

const router = Router();
const healthController = new HealthController();

router.get('/health', healthController.getHealth);
router.get('/', healthController.getApiInfo);

export { router as healthRoutes };
