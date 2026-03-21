import { api } from './api';

export const getUserAddresses = () => {
  return api.get<AddressProp[]>('/address');
};

export const createAddress = (data: AddressProp) => {
  return api.post<AddressProp>('/address', data);
};

export const getAddress = (id: string) => {
  return api.get<AddressProp>(`/address/${id}`);
};

export const updateAddress = (id: string, data: AddressProp) => {
  return api.patch<AddressProp>(`/address/${id}`, data);
};

export const deleteAddress = (id: string) => {
  return api.delete<AddressProp>(`/address/${id}`);
};
