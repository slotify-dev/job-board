// Application Status Types
export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'interviewed'
  | 'accepted'
  | 'rejected';

export const APPLICATION_STATUS_VALUES: ApplicationStatus[] = [
  'pending',
  'reviewing',
  'interviewed',
  'accepted',
  'rejected',
];

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

// Core Application Interface
export interface BaseJobApplication {
  uuid: string;
  resumeUrl: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: Date;
}

// Frontend Application (with string IDs)
export interface JobApplication extends BaseJobApplication {
  jobId: string;
  jobSeekerId: string;
  updatedAt: Date;
  applicant: {
    name: string;
    email: string;
    uuid: string;
  };
}

// Backend Application (with numeric IDs)
export interface JobApplicationWithSeeker extends BaseJobApplication {
  id: number;
  jobId: number;
  jobSeekerId: number;
  applicant: {
    name: string;
    email: string;
    uuid: string;
  };
}

// API Request/Response Types
export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface UpdateApplicationStatusResponse {
  success: boolean;
  application?: JobApplicationWithSeeker;
  message?: string;
}

export interface JobApplicationsResponse {
  success: boolean;
  applications: JobApplicationWithSeeker[];
}

// Frontend-specific response (adds extra fields)
export interface JobApplicationsResponseExtended
  extends JobApplicationsResponse {
  total: number;
  jobTitle: string;
}

// All applications response (for employer dashboard)
export interface AllApplicationsResponse {
  success: boolean;
  applications: (JobApplicationWithSeeker & {
    job: {
      title: string;
      uuid: string;
    };
  })[];
}
