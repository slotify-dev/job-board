import { useState, useEffect } from 'react';
import { employerJobService } from '../services/employerJobService';
import type {
  EmployerJob,
  CreateJobRequest,
  UpdateJobRequest,
} from '../types/employer.types';
import { toast } from 'sonner';

export function useEmployerJobs() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employerJobService.getMyJobs();
      setJobs(response.jobs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: CreateJobRequest) => {
    try {
      const response = await employerJobService.createJob(jobData);
      if (response.success && response.job) {
        setJobs((prev) => [response.job!, ...prev]);
        toast.success('Job posted successfully');
        return response.job;
      }
      throw new Error('Failed to create job');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create job';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateJob = async (jobData: UpdateJobRequest) => {
    try {
      const response = await employerJobService.updateJob(jobData);
      if (response.success && response.job) {
        setJobs((prev) =>
          prev.map((job) => (job.uuid === jobData.uuid ? response.job! : job)),
        );
        toast.success('Job updated successfully');
        return response.job;
      }
      throw new Error('Failed to update job');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update job';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteJob = async (uuid: string) => {
    try {
      await employerJobService.deleteJob(uuid);
      setJobs((prev) => prev.filter((job) => job.uuid !== uuid));
      toast.success('Job deleted successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete job';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
}
