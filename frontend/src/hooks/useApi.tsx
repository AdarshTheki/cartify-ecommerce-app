import { useState } from 'react';
import { type AxiosRequestConfig, type Method } from 'axios';
import { api, errorHandler } from '../services';

function useApi<T>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (
    url: string,
    method: Method = 'get',
    payload?: Record<string, unknown> | FormData,
    isFormData: boolean = false,
  ): Promise<T | undefined> => {
    setLoading(true);
    setError(null);

    try {
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

      const result: T = response.data?.data ?? response.data;

      setData(result);

      return result;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
    callApi,
    setData,
  };
}

export default useApi;
