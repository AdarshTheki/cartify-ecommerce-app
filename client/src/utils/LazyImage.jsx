import React, { useState, useRef, useEffect } from 'react';
import { images } from '../assets';

const LazyImage = ({
  src,
  placeholder,
  fallback = images.placeholder,
  alt = '',
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(placeholder || fallback);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imgRef.current && src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!didCancel && entry.isIntersecting) {
                const img = new Image();
                img.src = src;

                img.onload = () => !didCancel && setImgSrc(src);
                img.onerror = () => !didCancel && setImgSrc(fallback);

                observer.unobserve(imgRef.current);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(imgRef.current);
      } else {
        // Fallback if IntersectionObserver not supported
        const img = new Image();
        img.src = src;
        img.onload = () => !didCancel && setImgSrc(src);
        img.onerror = () => !didCancel && setImgSrc(fallback);
      }
    }

    return () => {
      didCancel = true;
      if (observer && observer.disconnect) observer.disconnect();
    };
  }, [src, fallback]);

  return <img ref={imgRef} src={imgSrc} alt={alt} {...rest} />;
};

export default LazyImage;
