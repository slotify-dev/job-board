export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  isActive?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token: string
  refreshToken: string
}