import type { AxiosRequestConfig, Method } from 'axios';
import { api } from './api';

export const fetchData = async <T>(
  url: string,
  method: Method = 'get',
  payload?: Record<string, unknown> | FormData,
  isFormData: boolean = false,
): Promise<T> => {
  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {},
  };

  if (method === 'get') {
    config.params = payload ?? {};
  } else {
    config.data = payload ?? {};

    // ✅ Handle multipart/form-data
    if (isFormData) {
      config.headers!['Content-Type'] = 'multipart/form-data';
    }
  }

  const response = await api(config);
  return response.data;
};
