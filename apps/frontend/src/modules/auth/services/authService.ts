import type {
  LoginFormData,
  RegisterFormData,
  AuthUser,
  User,
  RoleSelectionData,
} from '../types/auth.types';

import { formatAuthError } from '../utils/authHelpers';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  async login(credentials: LoginFormData): Promise<AuthUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>(response);

      const authUser: AuthUser = {
        ...data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return authUser;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async register(userData: RegisterFormData): Promise<AuthUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await this.handleResponse<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>(response);

      const authUser: AuthUser = {
        ...data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return authUser;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      const data = await this.handleResponse<{
        accessToken: string;
        refreshToken?: string;
      }>(response);

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      this.logout();
      throw new Error(formatAuthError(error));
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const newToken = await this.refreshToken();
            const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                ...this.getAuthHeaders(),
                Authorization: `Bearer ${newToken}`,
              },
            });

            if (retryResponse.ok) {
              const userData = await retryResponse.json();
              return {
                ...userData.user,
                accessToken: newToken,
              };
            }
          } catch {
            this.logout();
            return null;
          }
        }

        this.logout();
        return null;
      }

      const data = await response.json();
      return {
        ...data.user,
        accessToken: token,
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.logout();
      return null;
    }
  }

  async linkAuth0Account(
    auth0Sub: string,
    roleData: RoleSelectionData,
  ): Promise<AuthUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/link-auth0`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ auth0Sub, ...roleData }),
      });

      const data = await this.handleResponse<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>(response);

      const authUser: AuthUser = {
        ...data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return authUser;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
}

export const authService = new AuthService();
