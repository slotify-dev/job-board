export interface RegisterRequest {
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
  fullName?: string;
  companyName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  token?: string;
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
