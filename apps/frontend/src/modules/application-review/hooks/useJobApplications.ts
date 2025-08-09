import { useState, useEffect, useCallback } from 'react';
import { applicationReviewService } from '../services/applicationReviewService';
import type {
  JobApplication,
  ApplicationStatus,
} from '../types/application-review.types';
import { toast } from 'sonner';

export function useJobApplications(jobUuid: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await applicationReviewService.getJobApplications(jobUuid);
      setApplications(response.applications);
      setJobTitle(response.jobTitle);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch applications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobUuid]);

  const updateApplicationStatus = async (
    applicationUuid: string,
    status: ApplicationStatus,
  ) => {
    try {
      setUpdating(applicationUuid);
      const response = await applicationReviewService.updateApplicationStatus(
        applicationUuid,
        { status },
      );

      if (response.success && response.application) {
        setApplications((prev) =>
          prev.map((app) =>
            app.uuid === applicationUuid ? response.application! : app,
          ),
        );
        toast.success('Application status updated successfully');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update application status';
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdating(null);
    }
  };

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      reviewing: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });

    return counts;
  };

  useEffect(() => {
    if (jobUuid) {
      fetchApplications();
    }
  }, [jobUuid, fetchApplications]);

  return {
    applications,
    loading,
    error,
    jobTitle,
    updating,
    fetchApplications,
    updateApplicationStatus,
    getApplicationsByStatus,
    getStatusCounts,
  };
}
