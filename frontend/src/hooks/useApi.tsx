import { useState } from 'react';
import { AxiosError, type AxiosRequestConfig, type Method } from 'axios';
import { axiosInstance } from '../services';

function useApi<T>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (
    url: string,
    method: Method = 'get',
    payload?: Record<string, unknown>,
  ): Promise<T | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const config: AxiosRequestConfig = {
        url,
        method,
        ...(method === 'get' ? { params: payload ?? {} } : { data: payload ?? {} }),
      };

      const response = await axiosInstance(config);

      const result: T = response.data?.data ?? response.data;

      setData(result);

      return result;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const message = error.response?.data?.message || error.message || 'Something went wrong';

      setError(message);
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
