import type {
  PublicJob,
  JobsResponse as SharedJobsResponse,
  JobResponse as SharedJobResponse,
  JobListQuery as SharedJobListQuery,
} from '@job-board/shared-types';

// Re-export shared types
export type Job = PublicJob;
export type JobsResponse = SharedJobsResponse;
export type JobResponse = SharedJobResponse;
export type JobListQuery = SharedJobListQuery;
