import { api } from './api';

export const getProducts = () => {
  return api.get<ProductType[]>('/product');
};

export const getProduct = (id: string) => {
  return api.get<ProductType>(`/product/:${id}`);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/product/:${id}`);
};

export const updateProduct = (id: string, data: ProductType) => {
  return api.patch<ProductType>(`/product/:${id}`, data);
};

export const createProduct = (data: ProductType) => {
  return api.post<ProductType>('/product', data);
};

export const getCategoryByProducts = (name: string) => {
  return api.get<ProductType[]>(`/product/category/${name}`);
};

export const getBrandByProducts = (name: string) => {
  return api.get<ProductType[]>(`/product/brand/${name}`);
};

export const searchProducts = (name: string) => {
  return api.get<ProductType[]>(`/product/search?q=${name}`);
};
