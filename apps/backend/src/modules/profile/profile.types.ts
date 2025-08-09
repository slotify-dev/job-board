import { z } from 'zod';

export const updateJobSeekerProfileSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional(),
  address: z.string().max(1000).optional(),
  resumeUrl: z.string().url().optional(),
});

export const updateEmployerProfileSchema = z.object({
  companyName: z.string().min(1).max(255).optional(),
  contactPerson: z.string().min(1).max(255).optional(),
  companyWebsite: z.string().url().optional(),
});

export interface JobSeekerProfile {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  resumeUrl: string | null;
  createdAt: Date;
}

export interface EmployerProfile {
  userId: number;
  companyName: string;
  contactPerson: string;
  companyWebsite: string | null;
  createdAt: Date;
}

export interface ProfileResponse {
  success: boolean;
  profile?: JobSeekerProfile | EmployerProfile;
  userRole?: 'job_seeker' | 'employer';
}

export type UpdateJobSeekerProfileRequest = z.infer<
  typeof updateJobSeekerProfileSchema
>;
export type UpdateEmployerProfileRequest = z.infer<
  typeof updateEmployerProfileSchema
>;
