import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Auth0Callback() {
  const { isLoading: auth0Loading, error: auth0Error } = useAuth0();
  const { isAuthenticated, isNewAuth0User, isInitialized } = useAuth();

  // Show loading while Auth0 processes the callback
  if (auth0Loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  // Handle Auth0 errors
  if (auth0Error) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-black mb-2">
            Authentication Error
          </h2>
          <p className="text-primary-600 mb-4">{auth0Error.message}</p>
          <a href="/auth/login" className="btn-primary">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isNewAuth0User) {
    return <Navigate to="/auth/role-selection" replace />;
  }

  // If we get here, something went wrong - redirect to login
  return <Navigate to="/auth/login" replace />;
}
