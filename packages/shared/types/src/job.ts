// Job Status Types
export type JobStatus = 'active' | 'closed' | 'draft' | 'reviewing';

export const JOB_STATUS_VALUES: JobStatus[] = [
  'active',
  'closed',
  'draft',
  'reviewing',
];

// Block Editor Content Type
export type EditorData = Record<string, unknown>;

// Base Job Interface
export interface BaseJob {
  uuid: string;
  title: string;
  description: EditorData; // JSON content from block editor
  location: string | null;
  status: JobStatus;
  createdAt: Date;
}

// Public Job (for job browsing)
export interface PublicJob extends BaseJob {
  companyName: string | null;
}

// Employer Job (for job management)
export interface EmployerJob extends BaseJob {
  id: number;
}

// API Request Types
export interface CreateJobRequest {
  title: string;
  description: EditorData;
  location?: string;
  status?: JobStatus;
}

export interface UpdateJobRequest {
  title?: string;
  description?: EditorData;
  location?: string;
  status?: JobStatus;
}

// API Response Types
export interface JobResponse {
  success: boolean;
  job?: PublicJob;
}

export interface EmployerJobResponse {
  success: boolean;
  job?: EmployerJob;
}

export interface JobsResponse {
  success: boolean;
  jobs: PublicJob[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployerJobsResponse {
  success: boolean;
  jobs: EmployerJob[];
}

// Query Parameters
export interface JobListQuery {
  page?: number;
  limit?: number;
  location?: string;
  search?: string;
  status?: JobStatus;
}
