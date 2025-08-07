import type { AppState, Auth0ProviderOptions } from '@auth0/auth0-react';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!auth0Domain || !auth0ClientId) {
  throw new Error(
    'Auth0 configuration is missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.',
  );
}

export const auth0Config: Auth0ProviderOptions = {
  domain: auth0Domain,
  useRefreshTokens: true,
  clientId: auth0ClientId,
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: 'openid profile email',
    audience: auth0Audience,
  },
};

export const onRedirectCallback = (appState?: AppState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname,
  );
};

export const AUTH0_CONFIG = {
  domain: auth0Domain,
  clientId: auth0ClientId,
  audience: auth0Audience,
  logoutUrl: `${window.location.origin}/auth/login`,
  redirectUri: `${window.location.origin}/auth/callback`,
};
