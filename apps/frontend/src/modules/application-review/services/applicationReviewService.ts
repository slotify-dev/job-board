import type {
  JobApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from '../types/application-review.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const applicationReviewService = {
  async getJobApplications(jobUuid: string): Promise<JobApplicationsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/employer/jobs/${jobUuid}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job applications');
    }

    return response.json();
  },

  async updateApplicationStatus(
    applicationUuid: string,
    statusData: UpdateApplicationStatusRequest,
  ): Promise<UpdateApplicationStatusResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/employer/applications/${applicationUuid}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    return response.json();
  },
};
