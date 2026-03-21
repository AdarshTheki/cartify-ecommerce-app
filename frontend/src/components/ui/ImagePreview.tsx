import React, { useEffect, useCallback } from 'react';

type ImagePreviewProps = {
  preview: string | null;
  onClose: () => void;
  className?: string;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ preview, onClose, className = '' }) => {
  // ESC close
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (preview) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // lock scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [preview, handleEsc]);

  if (!preview) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/90 flex items-center justify-center ${className}`}
      onClick={onClose} // click outside closes
    >
      <img
        src={preview}
        alt='preview'
        className='max-w-full max-h-full object-contain p-4 cursor-zoom-out animate-fadeIn'
        onClick={(e) => e.stopPropagation()} // prevent close when clicking image
      />
    </div>
  );
};

export default React.memo(ImagePreview);
