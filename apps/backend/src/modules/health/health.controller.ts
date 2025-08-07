import type { Request, Response } from 'express';
import { HealthService } from './health.service.js';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  getHealth = (req: Request, res: Response): void => {
    const healthStatus = this.healthService.getHealthStatus();
    res.status(200).json(healthStatus);
  };

  getApiInfo = (req: Request, res: Response): void => {
    const apiInfo = this.healthService.getApiInfo();
    res.status(200).json(apiInfo);
  };
}
