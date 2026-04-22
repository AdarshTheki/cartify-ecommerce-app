import type { Address, AddressFormData } from '../types';
import { api } from './api';

export const getUserAddresses = () => {
  return api.get<Address[]>('/address');
};

export const createAddress = (data: AddressFormData) => {
  return api.post<Address>('/address', data);
};

export const getAddress = (id: string) => {
  return api.get<Address>(`/address/${id}`);
};

export const updateAddress = (id: string, data: AddressFormData) => {
  return api.patch<Address>(`/address/${id}`, data);
};

export const deleteAddress = (id: string) => {
  return api.delete<Address>(`/address/${id}`);
};
