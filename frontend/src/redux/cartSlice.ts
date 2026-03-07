import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../utils';

type InitialStateProps = {
  items: ItemsType[];
  loading: boolean;
  error: string | null;
};

const initialState: InitialStateProps = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCarts = createAsyncThunk<
  ItemsType[], // return type
  void, // argument type
  { rejectValue: string }
>('carts/fetchCarts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/cart`);
    if (response.data.docs === 0) return [];
    return response.data.docs;
  } catch {
    return rejectWithValue('Failed to fetch brand');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      return { ...state, items: action.payload };
    },
    removeItem: (state, action) => {
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload),
      };
    },
    updateItemQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((i) => (i.productId === _id ? { ...i, quantity } : i)),
      };
    },
    clearCart: (state) => {
      return { ...state, items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
        state.items = [];
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error.message ?? 'internal server error';
      });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
