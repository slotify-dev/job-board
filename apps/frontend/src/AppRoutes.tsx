import { useAuth } from './modules/auth/hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import { LoginPage } from './modules/auth/components/LoginPage';
import { RegisterPage } from './modules/auth/components/RegisterPage';
import { RoleSelectionPage } from './modules/auth/components/RoleSelectionPage';
import { Auth0Callback } from './modules/auth/components/Auth0Callback';
import {
  ProtectedRoute,
  PublicRoute,
} from './modules/auth/components/ProtectedRoute';

// Dashboard Components
import { JobSeekerDashboard } from './modules/jobSeeker/components/JobSeekerDashboard';
import { EmployerDashboard } from './modules/employer/components/EmployerDashboard';

// Job Browsing Components
import { HomePage } from './modules/job-browsing/pages/HomePage';
import { JobDetailsPage } from './modules/job-browsing/pages/JobDetailsPage';

export function AppRoutes() {
  const { isAuthenticated, isNewAuth0User, isInitialized } = useAuth();

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/:uuid" element={<JobDetailsPage />} />

      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/auth/callback" element={<Auth0Callback />} />

      {/* Role Selection for new Auth0 users */}
      <Route
        path="/auth/role-selection"
        element={
          isNewAuth0User ? (
            <RoleSelectionPage />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/job-seeker"
        element={
          <ProtectedRoute roles={['job_seeker']}>
            <JobSeekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute roles={['employer']}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard redirect */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/job-seeker" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-primary-50 flex items-center justify-center">
            <div className="card max-w-md mx-auto text-center">
              <h1 className="text-2xl font-bold text-black mb-4">
                Page Not Found
              </h1>
              <p className="text-primary-600 mb-4">
                The page you&#39;re looking for doesn&apos;t exist.
              </p>
              <a href="/" className="btn-primary">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
