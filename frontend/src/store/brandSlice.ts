import { api } from '../services';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Brand } from '../types';

// Define the type for the state
interface BrandStateProps {
  items: Brand[];
  loading: boolean;
  error: string | null;
}

// Initial state with type
const initialState: BrandStateProps = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk with typed response
export const fetchBrands = createAsyncThunk<
  Brand[], // return type
  void, // argument type
  { rejectValue: string }
>('brands/fetchBrands', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/brand?limit=50`);
    if (response.data.docs.length === 0) return [];
    return response.data.docs;
  } catch {
    return rejectWithValue('Failed to fetch brand');
  }
});

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default brandSlice.reducer;
