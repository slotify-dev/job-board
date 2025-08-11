import { z } from 'zod';
import {
  APPLICATION_STATUS_VALUES,
  UpdateApplicationStatusResponse as SharedUpdateApplicationStatusResponse,
  JobApplicationsResponse as SharedJobApplicationsResponse,
  EmployerJob as SharedEmployerJob,
  EmployerJobsResponse as SharedEmployerJobsResponse,
  EmployerJobResponse,
} from '@job-board/shared-types';

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
  status: z.enum(APPLICATION_STATUS_VALUES as [string, ...string[]]),
});

export const jobParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export const applicationParamsSchema = z.object({
  uuid: z.string().uuid(),
});

// Use shared types (re-export for compatibility)
export type EmployerJob = SharedEmployerJob;
export type JobApplicationsResponse = SharedJobApplicationsResponse;
export type EmployerJobsResponse = SharedEmployerJobsResponse;
export type ApplicationStatusResponse = SharedUpdateApplicationStatusResponse;

// Type aliases for shared types
export type JobResponse = EmployerJobResponse;

export type CreateJobRequest = z.infer<typeof createJobSchema>;
export type UpdateJobRequest = z.infer<typeof updateJobSchema>;
export type UpdateApplicationStatusRequest = z.infer<
  typeof updateApplicationStatusSchema
>;
export type JobParams = z.infer<typeof jobParamsSchema>;
export type ApplicationParams = z.infer<typeof applicationParamsSchema>;
