import type {
  CreateJobRequest as SharedCreateJobRequest,
  UpdateJobRequest as SharedUpdateJobRequest,
  EmployerJob as SharedEmployerJob,
  JobResponse,
  JobStatus,
  EditorData,
} from '@job-board/shared-types';

// Re-export shared types
export type CreateJobRequest = SharedCreateJobRequest;

// Frontend UpdateJobRequest includes uuid for routing
export interface UpdateJobRequest extends SharedUpdateJobRequest {
  uuid: string;
}

// Frontend EmployerJob extends shared type with additional fields
export interface EmployerJob extends SharedEmployerJob {
  updatedAt: Date;
  companyName: string | null;
}

// Frontend response extends shared response
export interface EmployerJobsResponse {
  success: boolean;
  jobs: EmployerJob[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateJobResponse extends JobResponse {
  job?: EmployerJob;
  message?: string;
}

export interface JobFormData {
  title: string;
  description: EditorData;
  location: string;
  status: JobStatus;
}
