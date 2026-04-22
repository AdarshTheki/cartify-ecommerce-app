import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services';
import type { Address } from '../types';

type InitialStateProp = {
  items: Address[];
  loading: boolean;
  error: string | null;
};

const initialState: InitialStateProp = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk('addresses/fetchAddresses', async () => {
  const response = await api.get(`/address`);
  return response?.data?.data;
});

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      return {
        ...state,
        items: action.payload?.isDefault
          ? [...state.items.map((i) => ({ ...i, isDefault: false })), action.payload]
          : [...state.items, action.payload],
      };
    },
    removeAddress: (state, action) => {
      return {
        ...state,
        items: state.items.filter((i) => i._id !== action.payload),
      };
    },
    updateAddress: (state, action) => {
      const item = action.payload;
      return {
        ...state,
        items: item?.isDefault
          ? state.items.map((i) => (i._id === item._id ? item : { ...i, isDefault: false }))
          : state.items.map((i) => (i._id === item._id ? item : i)),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        return { ...state, loading: false, items: action.payload };
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        return { ...state, loading: false, error: action.error.message ?? 'something went wrong!' };
      });
  },
});

export const { addAddress, updateAddress, removeAddress } = addressSlice.actions;

export default addressSlice.reducer;
