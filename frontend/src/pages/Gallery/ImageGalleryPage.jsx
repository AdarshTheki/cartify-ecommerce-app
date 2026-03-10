import GalleryImage from './GalleryImage';
import UploadImage from './UploadImage';

const Gallery = () => {
  return (
    <div className="max-w-6xl mx-auto min-h-screen p-3">
      <UploadImage />
      <GalleryImage />
    </div>
  );
};

export default Gallery;
