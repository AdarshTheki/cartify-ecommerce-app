import type { Product, ProductFormData } from '../types';
import { api } from './api';

export const getProducts = () => {
  return api.get<Product[]>('/product');
};

export const getProduct = (id: string) => {
  return api.get<Product>(`/product/:${id}`);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/product/:${id}`);
};

export const updateProduct = (id: string, data: ProductFormData) => {
  return api.patch<Product>(`/product/:${id}`, data);
};

export const createProduct = (data: ProductFormData) => {
  return api.post<Product>('/product', data);
};

export const getCategoryByProducts = (name: string) => {
  return api.get<Product[]>(`/product/category/${name}`);
};

export const getBrandByProducts = (name: string) => {
  return api.get<Product[]>(`/product/brand/${name}`);
};

export const searchProducts = (name: string) => {
  return api.get<Product[]>(`/product/search?q=${name}`);
};
