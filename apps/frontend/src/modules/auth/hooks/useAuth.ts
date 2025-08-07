import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '../../../shared/store/store';
import {
  getCurrentUserAsync,
  setAuth0User,
  setLoading,
  initialize,
  logout as reduxLogout,
} from '../store/authSlice';
import type { AuthUser } from '../types/auth.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  // Initialize auth state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      if (!authState.isInitialized) {
        if (!auth0IsLoading) {
          if (auth0IsAuthenticated && auth0User) {
            // User is authenticated with Auth0
            try {
              dispatch(setLoading(true));
              const token = await getAccessTokenSilently();

              // Check if this is a new Auth0 user or existing user
              const result = await dispatch(getCurrentUserAsync());

              if (
                getCurrentUserAsync.fulfilled.match(result) &&
                result.payload
              ) {
                // Existing user found
                const authUser: AuthUser = {
                  ...result.payload,
                  accessToken: token,
                };
                dispatch(setAuth0User(authUser));
              } else {
                // New Auth0 user - they'll need to select a role
                // This will be handled by the routing logic
                dispatch(initialize());
              }
            } catch (error) {
              console.error('Auth initialization error:', error);
              dispatch(initialize());
            }
          } else {
            // Check for existing session (traditional auth)
            await dispatch(getCurrentUserAsync());
          }
        }
      }
    };

    initializeAuth();
  }, [
    auth0IsAuthenticated,
    auth0IsLoading,
    auth0User,
    authState.isInitialized,
    dispatch,
    getAccessTokenSilently,
  ]);

  const logout = async () => {
    dispatch(reduxLogout());

    if (auth0IsAuthenticated) {
      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin + '/auth/login',
        },
      });
    }
  };

  const isNewAuth0User =
    auth0IsAuthenticated &&
    auth0User &&
    !authState.isAuthenticated &&
    authState.isInitialized;

  return {
    ...authState,
    logout,
    auth0User,
    isNewAuth0User,
    auth0IsAuthenticated,
  };
}
