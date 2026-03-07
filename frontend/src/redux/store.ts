import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './addressSlice';
import authReducer from './authSlice';
import brandReducer from './brandSlice';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    brand: brandReducer,
    address: addressReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
