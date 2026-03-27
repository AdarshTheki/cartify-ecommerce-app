import GalleryImage from './GalleryComponent';
import UploadImage from './UploadImage';

const GalleryPage = () => {
  return (
    <div className='max-w-6xl mx-auto min-h-screen p-3'>
      <UploadImage />
      <GalleryImage />
    </div>
  );
};

export default GalleryPage;
