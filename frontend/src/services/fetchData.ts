import type { AxiosRequestConfig, Method } from 'axios';
import { api } from './api';

export const fetchData = async <T>(
  url: string,
  method: Method = 'get',
  payload?: Record<string, unknown>,
): Promise<T> => {
  const config: AxiosRequestConfig = {
    url,
    method,
    ...(method === 'get' ? { params: payload ?? {} } : { data: payload ?? {} }),
  };

  const response = await api(config);
  return response.data;
};
