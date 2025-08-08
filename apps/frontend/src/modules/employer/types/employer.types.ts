export interface CreateJobRequest {
  title: string;
  description: string;
  location?: string;
  requirements?: string;
}

export interface UpdateJobRequest extends CreateJobRequest {
  uuid: string;
}

export interface EmployerJob {
  uuid: string;
  title: string;
  description: string;
  location: string | null;
  requirements: string | null;
  status: 'active' | 'closed' | 'draft';
  companyName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployerJobsResponse {
  success: boolean;
  jobs: EmployerJob[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateJobResponse {
  success: boolean;
  job?: EmployerJob;
  message?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  requirements: string;
}
