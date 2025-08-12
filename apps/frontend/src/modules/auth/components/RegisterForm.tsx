/* eslint-disable quotes */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema } from '../utils/authHelpers';
import type { RegisterFormData, UserRole } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../../../shared/store/store';
import { registerAsync, clearError } from '../store/authSlice';
import { useEffect } from 'react';
import { GoogleSignInButton } from './GoogleSignInButtonNew';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'job_seeker',
    label: 'Job Seeker',
    description: "I'm looking for job opportunities",
  },
  {
    value: 'employer',
    label: 'Employer',
    description: "I'm looking to hire talent",
  },
];

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerAsync(data));
      if (registerAsync.fulfilled.match(result)) {
        toast.success('Registration successful! Welcome to Job Board!');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black">Create Account</h2>
        <p className="text-primary-600 mt-2">Join our job board community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            I want to join as:
          </label>
          <div className="space-y-2">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === option.value
                    ? 'border-black bg-primary-50'
                    : 'border-primary-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    className="h-4 w-4 text-black focus:ring-black border-primary-300"
                    {...register('role')}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-black">
                      {option.label}
                    </div>
                    <div className="text-xs text-primary-600">
                      {option.description}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.role && <p className="error-text">{errors.role.message}</p>}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-black mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`input-field w-full ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="First name"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-black mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`input-field w-full ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Last name"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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
            placeholder="Create a password"
            {...register('password')}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-black mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`input-field w-full ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-primary-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleSignInButton
            role={watch('role') || 'job_seeker'}
            onSuccess={onSuccess}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-primary-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
