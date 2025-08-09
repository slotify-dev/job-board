export interface JobSeekerProfile {
  email: string;
  userId: number;
  fullName: string;
  createdAt: Date;
  phone: string | null;
  address: string | null;
  resumeUrl: string | null;
}

export interface UpdateJobSeekerProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  resumeUrl?: string;
}

export interface ProfileResponse {
  success: boolean;
  userRole?: 'job_seeker';
  profile?: JobSeekerProfile;
}
