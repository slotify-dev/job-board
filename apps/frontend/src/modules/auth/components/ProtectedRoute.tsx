import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../shared/store/store';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  roles?: UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  roles,
  fallbackPath = '/auth/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, isInitialized, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  // Show loading while initializing auth state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireAuth && roles && user) {
    const hasRequiredRole = roles.includes(user.role);

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const redirectPath =
        user.role === 'job_seeker'
          ? '/dashboard/job-seeker'
          : '/dashboard/employer';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific role protection
export function JobSeekerRoute({
  children,
  fallbackPath,
}: {
  children: ReactNode;
  fallbackPath?: string;
}) {
  return (
    <ProtectedRoute roles={['job_seeker']} fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  );
}

export function EmployerRoute({
  children,
  fallbackPath,
}: {
  children: ReactNode;
  fallbackPath?: string;
}) {
  return (
    <ProtectedRoute roles={['employer']} fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  );
}

// Component for public routes (redirects to dashboard if already authenticated)
export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const dashboardPath =
      user.role === 'job_seeker'
        ? '/dashboard/job-seeker'
        : '/dashboard/employer';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
