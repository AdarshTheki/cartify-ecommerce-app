import { api } from './api';

export const userDeleteByAdmin = (id: string) => {
  return api.delete(`/user/admin/${id}`);
};
