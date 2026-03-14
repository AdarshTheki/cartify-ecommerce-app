import { useState, useEffect } from 'react';

const useTypewriter = ({ text = '', speed = 100 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return { displayText };
};

export default useTypewriter;
