export interface EmployerProfile {
  userId: number;
  companyName: string;
  contactPerson: string;
  companyWebsite: string | null;
  createdAt: Date;
}

export interface UpdateEmployerProfileRequest {
  companyName?: string;
  contactPerson?: string;
  companyWebsite?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: EmployerProfile;
  userRole?: 'employer';
}
