import { z } from 'zod';

export const jobListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  location: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'closed', 'draft']).optional().default('active'),
});

export const jobParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export interface PublicJob {
  uuid: string;
  title: string;
  description: string;
  location: string | null;
  status: string;
  companyName: string | null;
  createdAt: Date;
}

export interface JobsResponse {
  success: boolean;
  jobs: PublicJob[];
  total: number;
  page: number;
  limit: number;
}

export interface JobResponse {
  success: boolean;
  job?: PublicJob;
}

export type JobListQuery = z.infer<typeof jobListQuerySchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;
