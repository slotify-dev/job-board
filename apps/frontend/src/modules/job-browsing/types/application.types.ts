export interface CreateApplicationRequest {
  resumeUrl: string;
  coverLetter?: string;
}

export interface ApplicationWithJob {
  uuid: string;
  jobId: number;
  jobSeekerId: number;
  resumeUrl: string;
  coverLetter: string | null;
  status: string;
  createdAt: Date;
  jobTitle: string;
  jobUuid: string;
  companyName: string;
}

export interface MyApplicationsResponse {
  success: boolean;
  applications: ApplicationWithJob[];
}

export interface ApplicationResponse {
  success: boolean;
  application?: ApplicationWithJob;
}
