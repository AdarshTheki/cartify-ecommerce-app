import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    const documentChangeHandler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Initial check
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mediaQueryList.matches);

    // Subscribe to changes (using 'change' event is optimal)
    mediaQueryList.addEventListener('change', documentChangeHandler);

    // Cleanup function
    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
