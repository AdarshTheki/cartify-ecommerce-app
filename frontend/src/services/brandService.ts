import type { Brand, BrandFormData, Pagination } from '../types';
import { api } from './api';

export const getBrands = () => {
  return api.get<Pagination<Brand>>('/brand');
};

export const createBrand = (data: BrandFormData) => {
  return api.post<Brand>('/brand', data);
};

export const getBrand = (id: string) => {
  return api.get<Brand>(`/brand/${id}`);
};

export const BrandUpdate = (id: string, data: BrandFormData) => {
  return api.patch(`/brand/${id}`, data);
};

export const BrandDelete = (id: string) => {
  return api.delete(`/brand/${id}`);
};
