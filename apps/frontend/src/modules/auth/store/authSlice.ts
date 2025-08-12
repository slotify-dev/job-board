import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthState,
  User, // eslint-disable-line @typescript-eslint/no-unused-vars
  LoginFormData,
  RegisterFormData,
} from '../types/auth.types';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed',
      );
    }
  },
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const user = await authService.register(userData);
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed',
      );
    }
  },
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to get user',
      );
    }
  },
);

export const selectRoleAsync = createAsyncThunk(
  'auth/selectRole',
  async (role: 'job_seeker' | 'employer', { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/select-role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ role }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to select role');
      }

      const { user } = await response.json();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Role selection failed',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Note: logout will be handled async via the logout thunk
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initialize: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get current user
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })

      // Role selection
      .addCase(selectRoleAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectRoleAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(selectRoleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setLoading, initialize } = authSlice.actions;

export default authSlice.reducer;
