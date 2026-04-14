import ImageListing from './ImageListing';
import MultiImageUpload from './MultiImageUpload';
import HeroSection from './HeroSection';

const ImageGalleryPage = () => {
  return (
    <div className='w-full space-y-10 '>
      <HeroSection />
      <MultiImageUpload />
      <ImageListing />
    </div>
  );
};

export default ImageGalleryPage;
