import { api } from './api';

export const getCarts = () => {
  return api.get<ItemsType[]>('/cart');
};

export const addToCart = (productId: string, quantity: number) => {
  return api.post<ItemsType>('/cart', { productId, quantity });
};

export const updateCartQuantity = (productId: string, quantity: number) => {
  return api.put<ItemsType>('/cart', { productId, quantity });
};

export const removeFromCart = (id: string) => {
  return api.delete(`/cart/${id}`);
};

export const clearCart = () => {
  return api.delete(`/cart`);
};
