export interface JobApplication {
  uuid: string;
  jobId: string;
  jobSeekerId: string;
  resumeUrl: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  applicant: {
    name: string;
    email: string;
    uuid: string;
  };
}

export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'interviewed'
  | 'accepted'
  | 'rejected';

export interface JobApplicationsResponse {
  success: boolean;
  applications: JobApplication[];
  total: number;
  jobTitle: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface UpdateApplicationStatusResponse {
  success: boolean;
  application?: JobApplication;
  message?: string;
}

export interface ApplicationStatusUpdate {
  applicationId: string;
  status: ApplicationStatus;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending Review',
  reviewing: 'Under Review',
  interviewed: 'Interviewed',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  interviewed: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
