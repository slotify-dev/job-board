import type { Request, Response } from 'express';
import { healthService } from '../services/health.ts';

export const healthController = {
  getHealth: async (req: Request, res: Response): Promise<void> => {
    try {
      const healthData = await healthService.getHealthStatus();
      res.json(healthData);
    } catch (error) {
      res.status(500).json({
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
