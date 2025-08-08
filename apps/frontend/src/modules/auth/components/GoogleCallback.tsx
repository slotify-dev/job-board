import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../shared/store/store';
import { authService } from '../services/authService';
import { googleOAuthService } from '../services/googleOAuth';
import { setLoading } from '../store/authSlice';
import { Layout } from '../../../shared/components/layout';
import type { UserRole } from '../types/auth.types';

export function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      dispatch(setLoading(true));

      try {
        const urlParams = new window.URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          throw new Error('Google OAuth was cancelled or failed');
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Parse role from state
        let role: UserRole = 'job_seeker';
        if (state) {
          try {
            const stateData = JSON.parse(state);
            role = stateData.role || 'job_seeker';
          } catch {
            // Ignore state parsing errors, use default role
          }
        }

        // Exchange code for access token
        const tokenResponse =
          await googleOAuthService.exchangeCodeForToken(code);

        // Get user info from Google
        const userInfo = await googleOAuthService.getUserInfo(
          tokenResponse.access_token,
        );

        // Send OAuth callback data to backend
        const user = await authService.oauthCallback({
          ssoId: userInfo.id,
          provider: 'google',
          email: userInfo.email,
          role,
        });

        // Update Redux state
        dispatch({
          type: 'auth/login/fulfilled',
          payload: user,
        });

        // Redirect based on role
        if (user.role === 'employer') {
          navigate('/dashboard/employer');
        } else {
          navigate('/dashboard/job-seeker');
        }
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        setError(
          error instanceof Error ? error.message : 'Google login failed',
        );

        // Redirect to login page after a delay
        window.setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        dispatch(setLoading(false));
      }
    };

    handleGoogleCallback();
  }, [dispatch, navigate]);

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md mx-auto text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-4">Login Failed</h1>
            <p className="text-primary-600 mb-4">{error}</p>
            <p className="text-sm text-primary-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-black mb-2">
            Completing Google Sign In
          </h2>
          <p className="text-primary-600">
            Please wait while we sign you in...
          </p>
        </div>
      </div>
    </Layout>
  );
}
