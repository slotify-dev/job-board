import { z } from 'zod';

export const registerSchema = z.object({
  role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),
});

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
});

export const oauthCallbackSchema = z.object({
  ssoId: z.string().min(1, 'SSO ID is required'),
  provider: z.enum(['google']).describe('OAuth provider'),
  role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
});

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export interface UserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type OAuthCallbackRequest = z.infer<typeof oauthCallbackSchema>;
