export interface JobSeekerProfile {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  resumeUrl: string | null;
  createdAt: Date;
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
  profile?: JobSeekerProfile;
  userRole?: 'job_seeker';
}
