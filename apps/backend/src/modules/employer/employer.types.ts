export interface CreateJobRequest {
  title: string;
  description: string;
  location?: string;
  status?: 'active' | 'draft';
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  location?: string;
  status?: 'active' | 'closed' | 'draft';
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  jobSeekerName?: string;
}

export interface UpdateApplicationStatusRequest {
  status: 'reviewed' | 'accepted' | 'rejected';
}

export interface EmployerJobsResponse {
  success: boolean;
  jobs?: Array<{
    id: string;
    title: string;
    description: string;
    location?: string;
    status: string;
    createdAt: string;
  }>;
}

export interface JobApplicationsResponse {
  success: boolean;
  applications?: JobApplication[];
  total?: number;
}
