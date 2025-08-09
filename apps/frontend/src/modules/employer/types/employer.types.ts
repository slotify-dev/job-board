import { EditorData, JobStatus } from '../../../shared/types/editorTypes';

export interface CreateJobRequest {
  title: string;
  description: EditorData; // Block editor JSON data
  location?: string;
  status?: JobStatus;
}

export interface UpdateJobRequest extends CreateJobRequest {
  uuid: string;
}

export interface EmployerJob {
  uuid: string;
  title: string;
  description: EditorData; // Block editor JSON data
  location: string | null;
  status: JobStatus;
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
  description: EditorData; // Block editor JSON data
  location: string;
  status: JobStatus;
}
