import { useState, useCallback } from 'react';
import { employerProfileService } from '../services/employerProfileService';
import type {
  EmployerProfile,
  UpdateEmployerProfileRequest,
} from '../types/profile.types';

export const useEmployerProfile = () => {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await employerProfileService.getProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: UpdateEmployerProfileRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updatedProfile =
          await employerProfileService.updateProfile(updates);
        setProfile(updatedProfile);
        return updatedProfile;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update profile',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
