// Common API Response Pattern
export interface ApiResponse {
  success: boolean;
  message?: string;
}

// UUID Parameter Type
export interface UuidParams {
  uuid: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse extends ApiResponse {
  total: number;
  page: number;
  limit: number;
}

// Common User Types
export interface UserRole {
  role: 'employer' | 'job_seeker';
}

export interface BaseUser {
  uuid: string;
  email: string;
  name: string;
}
