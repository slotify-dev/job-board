export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  status: 'active' | 'closed' | 'draft';
  employerId: string;
  createdAt: string;
}

export interface JobListQuery {
  page?: number;
  limit?: number;
  location?: string;
  search?: string;
}

export interface JobsResponse {
  success: boolean;
  jobs?: Job[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface JobResponse {
  success: boolean;
  job?: Job;
}
