import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import type { CreateApplicationRequest } from '../types/application.types';

// Query key factory
const applicationKeys = {
  all: ['applications'] as const,
  myApplications: () => [...applicationKeys.all, 'my'] as const,
};

// Hook to get my applications
export const useMyApplications = () => {
  return useQuery({
    queryKey: applicationKeys.myApplications(),
    queryFn: applicationService.getMyApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to apply to a job
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobUuid,
      applicationData,
    }: {
      jobUuid: string;
      applicationData: CreateApplicationRequest;
    }) => applicationService.applyToJob(jobUuid, applicationData),
    onSuccess: () => {
      // Invalidate and refetch my applications
      queryClient.invalidateQueries({
        queryKey: applicationKeys.myApplications(),
      });
    },
  });
};
