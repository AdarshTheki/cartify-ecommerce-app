import { axiosInstance } from '../utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the type for the state
interface CategoryState {
  items: CategoryType[];
  loading: boolean;
  error: string | null;
}

// Initial state with type
const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk with typed response
export const fetchCategories = createAsyncThunk<BrandType[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category?limit=50`);
      if (response.data.docs.length === 0) return [];
      return response.data.docs;
    } catch {
      return rejectWithValue('Failed to fetch brand');
    }
  },
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default categorySlice.reducer;
