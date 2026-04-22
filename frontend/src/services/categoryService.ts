import type { Category, CategoryFormData, Pagination } from '../types';
import { api } from './api';

export const getCategories = () => {
  return api.get<Pagination<Category>>('/category');
};

export const createCategories = (data: CategoryFormData) => {
  return api.post<Category>('/category', data);
};

export const getCategory = (id: string) => {
  return api.get<Category>(`/category/${id}`);
};

export const categoryUpdate = (id: string, data: CategoryFormData) => {
  return api.patch(`/category/${id}`, data);
};

export const categoryDelete = (id: string) => {
  return api.delete(`/category/${id}`);
};
