import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.any(), // JSON content from block editor
  location: z.string().max(255).optional(),
  status: z.enum(['active', 'draft', 'reviewing', 'closed']).default('active'),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.any().optional(), // JSON content from block editor
  location: z.string().max(255).optional(),
  status: z.enum(['active', 'closed', 'draft', 'reviewing']).optional(),
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
  description: Record<string, unknown>; // JSON content from block editor
  location: string | null;
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
