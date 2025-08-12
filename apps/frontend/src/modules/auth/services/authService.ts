import type {
  LoginFormData,
  RegisterFormData,
  User,
  UserRole,
} from '../types/auth.types';

interface OAuthCallbackData {
  ssoId: string;
  provider: 'google';
  email: string;
  role: UserRole;
}

interface GoogleSignInData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  role: UserRole;
}

import { formatAuthError } from '../utils/authHelpers';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class AuthService {
  private getAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: globalThis.Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  async login(credentials: LoginFormData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await this.handleResponse<{
        success: boolean;
        user: {
          id: string;
          uuid: string;
          email: string;
          role: string;
          createdAt?: string;
        };
      }>(response);

      if (!data.success || !data.user) {
        throw new Error('Login failed');
      }

      // Convert backend user format to frontend format
      const user: User = {
        id: data.user.uuid || data.user.id,
        email: data.user.email,
        firstName: '', // Backend doesn't have these fields yet
        lastName: '',
        role: data.user.role as UserRole,
        isEmailVerified: true, // Backend doesn't track this yet
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async register(userData: RegisterFormData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
        }),
      });

      const data = await this.handleResponse<{
        success: boolean;
        user: {
          id: string;
          uuid: string;
          email: string;
          role: string;
          createdAt?: string;
        };
      }>(response);

      if (!data.success || !data.user) {
        throw new Error('Registration failed');
      }

      // Convert backend user format to frontend format
      const user: User = {
        id: data.user.uuid || data.user.id,
        email: data.user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: data.user.role as UserRole,
        isEmailVerified: true,
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated
          return null;
        }
        throw new Error('Failed to get user info');
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        return null;
      }

      // Convert backend user format to frontend format
      const user: User = {
        id: data.user.uuid || data.user.id,
        email: data.user.email,
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        role: data.user.role as UserRole,
        isEmailVerified: data.user.isEmailVerified || true,
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: data.user.updatedAt || new Date().toISOString(),
      };

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async googleSignIn(googleData: GoogleSignInData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/google`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          providerId: googleData.googleId,
          email: googleData.email,
          name: googleData.name,
          picture: googleData.picture,
          role: googleData.role,
        }),
      });

      const data = await this.handleResponse<{
        success: boolean;
        user: {
          id: string;
          uuid: string;
          email: string;
          role: string;
          createdAt?: string;
        };
      }>(response);

      if (!data.success || !data.user) {
        throw new Error('Google sign-in failed');
      }

      // Convert backend user format to frontend format
      const user: User = {
        id: data.user.uuid || data.user.id,
        email: data.user.email,
        firstName: googleData.name.split(' ')[0] || '',
        lastName: googleData.name.split(' ').slice(1).join(' ') || '',
        role: data.user.role as UserRole,
        isEmailVerified: true,
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async oauthCallback(oauthData: OAuthCallbackData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/callback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(oauthData),
      });

      const data = await this.handleResponse<{
        success: boolean;
        user: {
          id: string;
          uuid: string;
          email: string;
          role: string;
          createdAt?: string;
        };
      }>(response);

      if (!data.success || !data.user) {
        throw new Error('OAuth callback failed');
      }

      // Convert backend user format to frontend format
      const user: User = {
        id: data.user.uuid || data.user.id,
        email: data.user.email,
        firstName: '', // Backend doesn't have these fields yet
        lastName: '',
        role: data.user.role as UserRole,
        isEmailVerified: true,
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  isAuthenticated(): boolean {
    // With cookie-based auth, we can't easily check client-side
    // This will be determined by the getCurrentUser call
    return false;
  }
}

export const authService = new AuthService();
