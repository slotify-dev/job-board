import type {
  CreateApplicationRequest,
  MyApplicationsResponse,
  ApplicationResponse,
} from '../types/application.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const applicationService = {
  // Apply to a job
  async applyToJob(
    jobUuid: string,
    applicationData: CreateApplicationRequest,
  ): Promise<ApplicationResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobUuid}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`Failed to apply to job: ${response.statusText}`);
    }

    return response.json();
  },

  // Get my applications
  async getMyApplications(): Promise<MyApplicationsResponse> {
    const response = await fetch(`${API_BASE_URL}/me/applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    return response.json();
  },
};
