import { env } from '../../config/env.js';
import type { HealthStatus, ApiInfo } from './health.model.js';

export class HealthService {
  getHealthStatus(): HealthStatus {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: env.API_VERSION,
      environment: env.NODE_ENV,
    };
  }

  getApiInfo(): ApiInfo {
    return {
      name: 'Job Board API',
      version: env.API_VERSION,
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  }
}
