# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth2 authentication for the job board application. Google OAuth allows users to sign in using their Google accounts instead of creating new passwords.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Job board application running locally

## Setup Process

### 1. Create Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project" to create a new project
4. Enter a project name (e.g., "Job Board App")
5. Click "Create"

### 2. Enable Required APIs

1. In your Google Cloud project, navigate to **APIs & Services** → **Library**
2. Search for and enable the following APIs:
   - **Google+ API** (if available)
   - **Google Identity Services**
   - **People API** (recommended for profile information)

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (for testing with any Google account)
3. Fill in the required information:
   - **App name**: Job Board Application
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload a logo for your app
   - **App domain**: `http://localhost:5173` (for development)
   - **Developer contact email**: Your email address
4. Click **Save and Continue**
5. **Scopes**: Click **Add or Remove Scopes** and add:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
6. **Test users** (for External apps): Add your email and any test user emails
7. Click **Save and Continue** through the remaining steps

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Configure the settings:
   - **Name**: Job Board Web Client
   - **Authorized JavaScript origins**:

     ```
     http://localhost:5173
     ```

   - **Authorized redirect URIs**:

     ```
     http://localhost:5173/auth/google/callback
     ```

5. Click **Create**
6. **Important**: Copy the generated Client ID and Client Secret

## Application Configuration

### Frontend Configuration

Add your Google Client ID to the frontend environment file:

```bash
# In apps/frontend/.env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### Backend Configuration

Add your Google OAuth credentials to the backend environment file:

```bash
# In apps/backend/.env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

**Security Note**: The Client Secret is only used server-side and never exposed to the frontend for security reasons.

## Testing the Setup

### 1. Restart Services

```bash
# Restart both frontend and backend to load new environment variables
docker-compose restart frontend
docker-compose restart backend
```

### 2. Test Google Sign-In

1. Visit `http://localhost:5173`
2. Click **"Continue with Google"** on the login or register page
3. You should be redirected to Google's authorization screen
4. Sign in with your Google account
5. Grant permissions to the application
6. You should be redirected back to the application and logged in

### 3. Verify User Creation

- Check that a new user record was created in the database
- Verify the user has the correct email from their Google account
- Confirm the user can access role-specific features

## Troubleshooting

### Common Issues

#### 1. "redirect_uri_mismatch" Error

**Problem**: The redirect URI in your request doesn't match any of the authorized redirect URIs.

**Solution**:

- Verify the redirect URI in Google Cloud Console exactly matches: `http://localhost:5173/auth/google/callback`
- Check that `VITE_GOOGLE_REDIRECT_URI` and `GOOGLE_REDIRECT_URI` environment variables match
- Ensure no trailing slashes or extra characters

#### 2. "invalid_client" Error

**Problem**: The client ID is incorrect or not found.

**Solution**:

- Double-check the `VITE_GOOGLE_CLIENT_ID` in your frontend `.env` file
- Ensure the Client ID matches exactly what's shown in Google Cloud Console
- Verify there are no extra spaces or characters

#### 3. "access_denied" Error

**Problem**: User denied permission or app not properly configured.

**Solution**:

- Ensure OAuth consent screen is properly configured
- Add test users if using External user type during development
- Check that required scopes are properly configured

#### 4. Environment Variables Not Loading

**Problem**: New environment variables aren't being recognized.

**Solution**:

```bash
# Stop and restart all services
docker-compose down
docker-compose up --build
```

#### 5. Google Sign-In Button Not Appearing

**Problem**: Frontend can't initialize Google OAuth.

**Solution**:

- Check browser console for JavaScript errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- Ensure frontend service restarted after environment changes

### Debugging Tips

1. **Check Environment Variables**:

   ```bash
   # In frontend container
   docker-compose exec frontend printenv | grep VITE_GOOGLE

   # In backend container
   docker-compose exec backend printenv | grep GOOGLE
   ```

2. **Monitor Network Requests**:
   - Open browser DevTools → Network tab
   - Watch for OAuth-related requests during sign-in process
   - Check for any failed API calls

3. **Backend Logs**:

   ```bash
   # Monitor backend logs for OAuth errors
   docker-compose logs -f backend
   ```

## Production Deployment

When deploying to production, update the OAuth configuration:

### Google Cloud Console Updates

1. **Authorized JavaScript Origins**:

   ```
   https://yourdomain.com
   ```

2. **Authorized Redirect URIs**:

   ```
   https://yourdomain.com/auth/google/callback
   ```

### Environment Variables

Update your production environment variables:

```bash
# Frontend
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Backend
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### Security Considerations

- **Use HTTPS** in production for all OAuth redirects
- **Restrict domains** in Google Cloud Console to your actual production domains
- **Use environment-specific** Client IDs for different environments (dev, staging, prod)
- **Never commit** Client Secrets to version control
- **Regularly rotate** Client Secrets in production

## Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## Support

If you encounter issues not covered in this guide:

1. Check the [SSO Authentication Documentation](sso.md) for implementation details
2. Review the [Design Architecture Documentation](design.md) for OAuth flow explanation
3. Search existing issues in the project repository
4. Create a new issue with detailed error messages and steps to reproduce
