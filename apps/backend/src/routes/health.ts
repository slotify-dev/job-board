import { Router } from 'express'
import { healthController } from '../controllers/health.ts'

export const healthRouter = Router()

healthRouter.get('/', healthController.getHealth)