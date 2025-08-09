import type {
  CreateJobRequest,
  UpdateJobRequest,
  EmployerJobsResponse,
  CreateJobResponse,
  EmployerJob,
} from '../types/employer.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const employerJobService = {
  async getMyJobs(): Promise<EmployerJobsResponse> {
    const response = await fetch(`${API_BASE_URL}/employer/jobs`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  async createJob(jobData: CreateJobRequest): Promise<CreateJobResponse> {
    const response = await fetch(`${API_BASE_URL}/employer/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error('Failed to create job');
    }

    return response.json();
  },

  async updateJob(jobData: UpdateJobRequest): Promise<CreateJobResponse> {
    const response = await fetch(
      `${API_BASE_URL}/employer/jobs/${jobData.uuid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          requirements: jobData.requirements,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update job');
    }

    return response.json();
  },

  async deleteJob(uuid: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/employer/jobs/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }

    return response.json();
  },

  async getJobById(
    uuid: string,
  ): Promise<{ success: boolean; job?: EmployerJob }> {
    const response = await fetch(`${API_BASE_URL}/employer/jobs/${uuid}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  },
};
