import type { Category, Pagination } from '../types';
import { api } from './api';

export const getCategories = () => {
  return api.get<Pagination<Category>>('/category');
};

export const getCategory = (id: string) => {
  return api.get<Category>(`/category/${id}`);
};

export const categoryUpdate = (id: string, data: Category) => {
  return api.patch(`/category/${id}`, data);
};

export const categoryDelete = (id: string) => {
  return api.delete(`/category/${id}`);
};
