export interface HealthStatus {
  status: 'OK' | 'ERROR';
  timestamp: string;
  version?: string;
  environment?: string;
}

export interface ApiInfo {
  name: string;
  version: string;
  environment: string;
  timestamp: string;
}
