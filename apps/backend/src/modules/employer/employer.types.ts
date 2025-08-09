import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  location: z.string().max(255).optional(),
  requirements: z.string().optional(),
  status: z.enum(['active', 'draft']).default('active'),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  location: z.string().max(255).optional(),
  requirements: z.string().optional(),
  status: z.enum(['active', 'closed', 'draft']).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['reviewed', 'accepted', 'rejected']),
});

export const jobParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export const applicationParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export interface EmployerJob {
  id: number;
  uuid: string;
  title: string;
  description: string;
  location: string | null;
  requirements: string | null;
  status: string;
  createdAt: Date;
}

export interface JobApplicationWithSeeker {
  uuid: string;
  jobId: number;
  jobSeekerId: number;
  resumeUrl: string;
  coverLetter: string | null;
  status: string;
  createdAt: Date;
  jobSeekerName: string;
  jobSeekerContactInfo: string | null;
}

export interface EmployerJobsResponse {
  success: boolean;
  jobs: EmployerJob[];
}

export interface JobApplicationsResponse {
  success: boolean;
  applications: JobApplicationWithSeeker[];
}

export interface JobResponse {
  success: boolean;
  job?: EmployerJob;
}

export interface ApplicationStatusResponse {
  success: boolean;
}

export type CreateJobRequest = z.infer<typeof createJobSchema>;
export type UpdateJobRequest = z.infer<typeof updateJobSchema>;
export type UpdateApplicationStatusRequest = z.infer<
  typeof updateApplicationStatusSchema
>;
export type JobParams = z.infer<typeof jobParamsSchema>;
export type ApplicationParams = z.infer<typeof applicationParamsSchema>;
