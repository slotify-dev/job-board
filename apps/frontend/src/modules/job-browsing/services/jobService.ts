import type {
  JobsResponse,
  JobResponse,
  JobListQuery,
} from '../types/job.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const jobService = {
  async getJobs(params: JobListQuery = {}): Promise<JobsResponse> {
    const searchParams = new window.URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.location) searchParams.set('location', params.location);
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);

    const response = await fetch(
      `${API_BASE_URL}/jobs?${searchParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  async getJobById(uuid: string): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${uuid}`);

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  },
};
