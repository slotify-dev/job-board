import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema } from '../utils/authHelpers';
import type { LoginFormData } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../../../shared/store/store';
import { loginAsync, clearError } from '../store/authSlice';
import { useEffect } from 'react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginAsync(data));
      if (loginAsync.fulfilled.match(result)) {
        toast.success('Login successful!');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black">Sign In</h2>
        <p className="text-primary-600 mt-2">Welcome back to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`input-field w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`input-field w-full ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-black focus:ring-black border-primary-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-primary-700"
            >
              Remember me
            </label>
          </div>
          <Link to="/auth/forgot-password" className="text-sm link">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-primary-600">
          Don&#39;t have an account?{' '}
          <Link to="/auth/register" className="link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
