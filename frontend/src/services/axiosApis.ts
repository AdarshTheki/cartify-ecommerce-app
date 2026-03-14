import { axiosInstance } from './axiosInstance';

export const getProducts = () => {
  return axiosInstance.get('/products');
};

export const createProduct = (data: ProductType) => {
  return axiosInstance.post('/products', data);
};
