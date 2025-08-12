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
    applicationData: CreateApplicationRequest | FormData,
  ): Promise<ApplicationResponse> {
    const isFormData = applicationData instanceof FormData;

    const requestConfig: RequestInit = {
      method: 'POST',
      credentials: 'include',
    };

    if (isFormData) {
      // For FormData, don't set Content-Type header - browser will set it with boundary
      requestConfig.body = applicationData;
    } else {
      // For JSON data
      requestConfig.headers = {
        'Content-Type': 'application/json',
      };
      requestConfig.body = JSON.stringify(applicationData);
    }

    const response = await fetch(
      `${API_BASE_URL}/jobs/${jobUuid}/apply`,
      requestConfig,
    );

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('You have already applied to this job.');
      } else if (response.status === 403) {
        throw new Error('Only job seekers can apply to jobs.');
      } else if (response.status === 404) {
        throw new Error('This job is no longer available.');
      } else if (response.status === 400) {
        throw new Error('Please provide a resume to apply.');
      } else {
        throw new Error(`Failed to apply to job: ${response.statusText}`);
      }
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
