import { EditorData } from '../../../shared/types/editorTypes';

export interface Job {
  uuid: string;
  title: string;
  description: EditorData; // Block editor JSON data
  location: string | null;
  status: string;
  companyName: string | null;
  createdAt: Date;
}

export interface JobsResponse {
  success: boolean;
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface JobResponse {
  success: boolean;
  job?: Job;
}

export interface JobListQuery {
  page?: number;
  limit?: number;
  location?: string;
  search?: string;
  status?: 'active' | 'closed' | 'draft';
}
