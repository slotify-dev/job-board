import type {
  JobSeekerProfile,
  ProfileResponse,
  UpdateJobSeekerProfileRequest,
} from '../types/profile.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface FileUploadResponse {
  success: boolean;
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  message?: string;
}

class ProfileService {
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

  async getProfile(): Promise<JobSeekerProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/me/profile`, {
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      const data = await this.handleResponse<ProfileResponse>(response);

      if (!data.success || !data.profile) {
        return null;
      }

      return {
        ...data.profile,
        createdAt: new Date(data.profile.createdAt),
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(
    updates: UpdateJobSeekerProfileRequest,
  ): Promise<JobSeekerProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/me/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await this.handleResponse<ProfileResponse>(response);

      if (!data.success || !data.profile) {
        throw new Error('Failed to update profile');
      }

      return {
        ...data.profile,
        createdAt: new Date(data.profile.createdAt),
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async uploadResume(file: File): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_BASE_URL}/upload/resume`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await this.handleResponse<FileUploadResponse>(response);

      if (!data.success) {
        throw new Error(data.message || 'Failed to upload resume');
      }

      return data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
