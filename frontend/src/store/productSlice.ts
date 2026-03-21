import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../services';
import type { Product } from '../types';

// Async thunk with typed response
export const fetchProducts = createAsyncThunk<
  Product[], // return type
  void, // argument type
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/product`);
    if (response.data.docs.length === 0) return [];
    return response.data.docs;
  } catch {
    return rejectWithValue('Failed to fetch brand');
  }
});

type InitialStateProp = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: InitialStateProp = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        return { ...state, loading: false, items: action.payload };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        return { ...state, loading: false, error: action.error.message ?? 'internal server error' };
      });
  },
});

export default productSlice.reducer;
