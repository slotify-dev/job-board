// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

export class GoogleOAuthService {
  private static instance: GoogleOAuthService;

  static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  // Generate Google OAuth URL
  getGoogleAuthUrl(role?: 'job_seeker' | 'employer'): string {
    const params = new window.URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      ...(role && { state: JSON.stringify({ role }) }), // Only pass role in state if provided
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Start Google OAuth flow
  startGoogleAuth(role?: 'job_seeker' | 'employer'): void {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID not configured');
    }

    const authUrl = this.getGoogleAuthUrl(role);
    window.location.href = authUrl;
  }
}

export const googleOAuthService = GoogleOAuthService.getInstance();
