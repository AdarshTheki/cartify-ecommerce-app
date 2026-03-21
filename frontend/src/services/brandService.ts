import type { Brand, Pagination } from '../types';
import { api } from './api';

export const getBrands = () => {
  return api.get<Pagination<Brand>>('/brand');
};

export const getBrand = (id: string) => {
  return api.get<Brand>(`/brand/${id}`);
};

export const BrandUpdate = (id: string, data: Brand) => {
  return api.patch(`/brand/${id}`, data);
};

export const BrandDelete = (id: string) => {
  return api.delete(`/brand/${id}`);
};
