import type {
  JobApplication as SharedJobApplication,
  ApplicationStatus,
  JobApplicationsResponseExtended,
  UpdateApplicationStatusRequest as SharedUpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse as SharedUpdateApplicationStatusResponse,
} from '@job-board/shared-types';
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from '@job-board/shared-types';

// Frontend uses extended response with additional fields
export type JobApplicationsResponse = JobApplicationsResponseExtended;

// Frontend JobApplication interface (compatible with shared type)
export interface JobApplication extends SharedJobApplication {
  updatedAt: Date;
}

// Re-export shared types
export type { ApplicationStatus };
export { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS };
export type UpdateApplicationStatusRequest =
  SharedUpdateApplicationStatusRequest;
export type UpdateApplicationStatusResponse =
  SharedUpdateApplicationStatusResponse;

export interface ApplicationStatusUpdate {
  applicationId: string;
  status: ApplicationStatus;
}
