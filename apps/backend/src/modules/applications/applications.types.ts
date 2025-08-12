import { z } from 'zod';

export const createApplicationSchema = z.object({
  resumeUrl: z.string().url().optional(), // Now optional when file is uploaded
  coverLetter: z.string().max(2000).optional(),
});

export const jobParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export interface ApplicationWithJob {
  uuid: string;
  jobId: number;
  jobSeekerId: number;
  resumeUrl: string;
  coverLetter: string | null;
  status: string;
  createdAt: Date;
  jobTitle: string;
  jobUuid: string;
  companyName: string;
}

export interface MyApplicationsResponse {
  success: boolean;
  applications: ApplicationWithJob[];
}

export interface ApplicationResponse {
  success: boolean;
  application?: ApplicationWithJob;
}

export type CreateApplicationRequest = z.infer<typeof createApplicationSchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;
