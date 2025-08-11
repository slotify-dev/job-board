import type {
  JobApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from '../types/application-review.types';
import type { AllApplicationsResponse } from '@job-board/shared-types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const applicationReviewService = {
  async getJobApplications(jobUuid: string): Promise<JobApplicationsResponse> {
    const response = await fetch(
      `${API_BASE_URL}/employer/jobs/${jobUuid}/applications`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job applications');
    }

    return response.json();
  },

  async getAllApplications(): Promise<AllApplicationsResponse> {
    const response = await fetch(`${API_BASE_URL}/employer/applications`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all applications');
    }

    return response.json();
  },

  async updateApplicationStatus(
    applicationUuid: string,
    statusData: UpdateApplicationStatusRequest,
  ): Promise<UpdateApplicationStatusResponse> {
    const response = await fetch(
      `${API_BASE_URL}/employer/applications/${applicationUuid}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(statusData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    return response.json();
  },
};
