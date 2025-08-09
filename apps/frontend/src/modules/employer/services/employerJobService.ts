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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employer/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  async createJob(jobData: CreateJobRequest): Promise<CreateJobResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employer/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error('Failed to create job');
    }

    return response.json();
  },

  async updateJob(jobData: UpdateJobRequest): Promise<CreateJobResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/employer/jobs/${jobData.uuid}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employer/jobs/${uuid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }

    return response.json();
  },

  async getJobById(
    uuid: string,
  ): Promise<{ success: boolean; job?: EmployerJob }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/jobs/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  },
};
