import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/store/store';
import {
  getCurrentUserAsync,
  loginAsync,
  registerAsync,
  setLoading,
  initialize,
  logout as reduxLogout,
} from '../store/authSlice';
import { authService } from '../services/authService';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  // Initialize auth state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      if (!authState.isInitialized) {
        dispatch(setLoading(true));

        try {
          // Try to get current user from backend (checks cookie)
          await dispatch(getCurrentUserAsync());
        } catch (error) {
          console.error('Failed to initialize auth:', error);
        }

        dispatch(initialize());
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch, authState.isInitialized]);

  const login = async (credentials: LoginFormData) => {
    const result = await dispatch(loginAsync(credentials));
    return result;
  };

  const register = async (userData: RegisterFormData) => {
    const result = await dispatch(registerAsync(userData));
    return result;
  };

  const logout = async () => {
    // Call backend logout first, then update Redux state
    try {
      await authService.logout();
    } finally {
      dispatch(reduxLogout());
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    isInitialized: authState.isInitialized,
    login,
    register,
    logout,
  };
}
