import { X } from 'lucide-react';
import React from 'react';

const ImagePreview = React.memo(({ preview, closePreview, className = '' }) => {
  if (!preview) return null;

  return (
    <div
      className={`fixed inset-0 !top-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[100] ${className}`}>
      <div className="max-w-[420px] w-full px-2 animate-in fade-in zoom-in-95 relative">
        <button className="svg-btn mx-auto w-fit">
          <X onClick={closePreview} />
        </button>
        <img
          src={preview}
          alt="image-preview"
          className="w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
});

export default ImagePreview;
