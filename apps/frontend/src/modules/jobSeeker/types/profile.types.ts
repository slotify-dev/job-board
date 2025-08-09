export interface JobSeekerProfile {
  userId: number;
  fullName: string;
  contactInfo: string | null;
  resumeUrl: string | null;
  createdAt: Date;
}

export interface UpdateJobSeekerProfileRequest {
  fullName?: string;
  contactInfo?: string;
  resumeUrl?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: JobSeekerProfile;
  userRole?: 'job_seeker';
}
