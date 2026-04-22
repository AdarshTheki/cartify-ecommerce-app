import { useState, useEffect, useCallback } from 'react';
import { api } from '../services';

interface UseFetchProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setData: (value: T) => void;
  refetch: () => void;
}

const useFetch = <T,>(url: string): UseFetchProps<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      if (res.data) setData(res.data.data || res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
};

export default useFetch;
