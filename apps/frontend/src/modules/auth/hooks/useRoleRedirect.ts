import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../shared/store/store';
import type { UserRole } from '../types/auth.types';

export function useRoleRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'job_seeker':
      return '/dashboard/job-seeker';
    case 'employer':
      return '/dashboard/employer';
    default:
      return '/';
  }
}

export function useRedirectAfterAuth() {
  const navigate = useNavigate();

  const redirectToRoleDashboard = (role: UserRole) => {
    const dashboardPath = getDashboardPath(role);
    navigate(dashboardPath, { replace: true });
  };

  return { redirectToRoleDashboard };
}
