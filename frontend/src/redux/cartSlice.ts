import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../services';

type ItemsListProp = {
  _id: string;
  productId: ProductType;
  quantity: number;
};

type InitialStateProps = {
  items: ItemsListProp[];
  loading: boolean;
  error: string | null;
  totalQuantity: number;
  totalAmount: number;
};

const initialState: InitialStateProps = {
  items: [],
  loading: false,
  error: null,
  totalQuantity: 0,
  totalAmount: 0,
};

export const fetchCarts = createAsyncThunk<
  ItemsListProp[], // return type
  void, // argument type
  { rejectValue: string }
>('carts/fetchCarts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/cart`);
    if (response.data.items === 0) return [];
    return response.data.items;
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
        return { ...state, loading: true };
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        return { ...state, loading: false, items: action.payload };
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message ?? 'Internal server error!',
        };
      });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
