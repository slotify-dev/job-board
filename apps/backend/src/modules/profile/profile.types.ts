export interface JobSeekerProfile {
  userId: string;
  fullName: string;
  contactInfo?: string;
  resumeUrl?: string;
  createdAt: string;
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  contactPerson: string;
  companyWebsite?: string;
  createdAt: string;
}

export interface UpdateJobSeekerProfileRequest {
  fullName?: string;
  contactInfo?: string;
  resumeUrl?: string;
}

export interface UpdateEmployerProfileRequest {
  companyName?: string;
  contactPerson?: string;
  companyWebsite?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: JobSeekerProfile | EmployerProfile;
  userRole?: 'job_seeker' | 'employer';
}
