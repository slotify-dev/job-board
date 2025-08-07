export interface CreateApplicationRequest {
  resumeUrl: string;
  coverLetter?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location?: string;
  };
}

export interface MyApplicationsResponse {
  success: boolean;
  applications?: Application[];
  total?: number;
}

export interface ApplicationResponse {
  success: boolean;
  application?: Application;
}
