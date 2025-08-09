const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface SimpleProfile {
  userId: number;
  fullName: string;
  contactInfo: string | null;
  resumeUrl: string | null;
  createdAt: Date;
}

class ProfileServiceSimple {
  async getProfile(): Promise<SimpleProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/me/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.log('Profile fetch failed:', response.status);
        return null;
      }

      const data = await response.json();

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
}

export const profileServiceSimple = new ProfileServiceSimple();
export type { SimpleProfile };
