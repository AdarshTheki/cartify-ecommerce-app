import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../services';

type AuthStateProp = {
  loading: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  error: string | null;
};

const initialState: AuthStateProp = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<UserType, void, { rejectValue: string }>(
  'currentUser/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/current-user');
      return response.data?.data;
    } catch {
      return rejectWithValue('user not authenticate with current user');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserType>) => {
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...action.payload },
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        return { ...state, user: action.payload, isAuthenticated: true, loading: false };
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        return {
          ...state,
          isAuthenticated: false,
          loading: false,
          error: action.error.message ?? 'Internal server error',
        };
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
