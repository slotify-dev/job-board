import { useQuery } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import type { JobListQuery } from '../types/job.types';

export const useJobs = (params: JobListQuery = {}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJob = (uuid: string) => {
  return useQuery({
    queryKey: ['job', uuid],
    queryFn: () => jobService.getJobById(uuid),
    enabled: !!uuid,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
