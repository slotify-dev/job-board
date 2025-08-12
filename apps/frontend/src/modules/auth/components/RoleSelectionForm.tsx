import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import type { UserRole } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../../../shared/store/store';
import { selectRoleAsync, clearError } from '../store/authSlice';
import { useEffect } from 'react';

const roleSelectionSchema = z.object({
  role: z.enum(['job_seeker', 'employer'], {
    required_error: 'Please select a role',
  }),
});

type RoleSelectionData = z.infer<typeof roleSelectionSchema>;

interface RoleSelectionFormProps {
  userName?: string;
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

export function RoleSelectionForm({
  userName = 'there',
  onSuccess,
}: RoleSelectionFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoleSelectionData>({
    resolver: zodResolver(roleSelectionSchema),
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RoleSelectionData) => {
    try {
      const result = await dispatch(selectRoleAsync(data.role));

      if (selectRoleAsync.fulfilled.match(result)) {
        toast.success('Account setup complete! Welcome to Job Board!');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Role selection error:', err);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black">Welcome, {userName}!</h2>
        <p className="text-primary-600 mt-2">
          Please select your role to complete your account setup
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2" />
              Setting up account...
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-primary-500">
          You can change your role later in your account settings
        </p>
      </div>
    </div>
  );
}
