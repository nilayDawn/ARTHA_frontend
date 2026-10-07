import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/api/auth';

export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return rejectWithValue(error.message);
    if (!data?.session) return { session: null, user: null, profile: null };

    const session = data.session;
    const user = session.user;

    let profile = null;
    try {
      const profileRes = await getUserProfile();
      profile = profileRes.data;
    } catch {
      // Fallback profile if profile endpoint is pending or fresh user
      profile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
      };
    }

    return { session, user, profile };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to initialize session');
  }
});

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return rejectWithValue(error.message);

      let profile = null;
      try {
        const profileRes = await getUserProfile();
        profile = profileRes.data;
      } catch {
        profile = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
        };
      }

      return { session: data.session, user: data.user, profile };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, full_name }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: full_name || '' },
        },
      });

      if (error) return rejectWithValue(error.message);
      return { session: data.session, user: data.user, profile: null };
    } catch (err) {
      return rejectWithValue(err.message || 'Sign up failed');
    }
  }
);

export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await supabase.auth.signOut();
    return null;
  } catch (err) {
    return rejectWithValue(err.message || 'Logout failed');
  }
});

const initialState = {
  user: null,
  session: null,
  profile: null,
  status: 'loading', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { session, user } = action.payload || {};
      state.session = session ?? null;
      state.user = user ?? null;
      state.status = 'succeeded';
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // initializeAuth
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // loginWithEmail
      .addCase(loginWithEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // signUpWithEmail
      .addCase(signUpWithEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // logout
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.profile = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setAuthState, clearAuthError } = authSlice.actions;

// Granular Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserProfile = (state) => state.auth.profile;
export const selectAuthSession = (state) => state.auth.session;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.status === 'loading';
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
