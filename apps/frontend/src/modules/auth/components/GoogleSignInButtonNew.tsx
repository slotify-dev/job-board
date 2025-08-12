import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../shared/store/store';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import type { UserRole } from '../types/auth.types';

interface GoogleSignInButtonProps {
  role: UserRole;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function GoogleSignInButton({
  role,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  children,
}: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Get user info from Google using the access token
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${codeResponse.access_token}`,
        );

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user information from Google');
        }

        const userInfo = await userInfoResponse.json();

        // Send to our backend for processing
        const user = await authService.googleSignIn({
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          accessToken: codeResponse.access_token,
          role,
        });

        // Update Redux state
        dispatch({
          type: 'auth/login/fulfilled',
          payload: user,
        });

        toast.success(`Welcome, ${userInfo.name}!`);
        onSuccess?.();

        // Redirect based on role
        if (user.role === 'employer') {
          navigate('/dashboard/employer');
        } else {
          navigate('/dashboard/job-seeker');
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Google sign-in failed';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      const errorMessage = 'Google sign-in failed. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    },
  });

  const handleClick = () => {
    if (!disabled) {
      login();
    }
  };

  // Default button design if no children provided
  const defaultButton = (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center px-4 py-2 border border-gray-300 
        rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>
  );

  // If children provided, wrap them with click handler
  if (children) {
    return (
      <div
        onClick={handleClick}
        className={
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }
      >
        {children}
      </div>
    );
  }

  return defaultButton;
}
