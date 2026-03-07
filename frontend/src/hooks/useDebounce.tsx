import { useState, useEffect } from 'react';

// Custom useDebounce Hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Cleanup function to reset timeout
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
