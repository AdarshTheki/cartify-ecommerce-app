import { Eye } from 'lucide-react';
import type { Image } from '../../types';

interface ImageCardProps {
  image: Image;
  onSelectedClick: (image: Image) => void;
}

const ImageCard = ({ image, onSelectedClick }: ImageCardProps) => {
  return (
    <div
      className='w-full border break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl'
      onClick={() => onSelectedClick(image)}>
      {/* Image */}
      <img
        src={image.url}
        loading='lazy'
        className='w-full h-40 object-cover group-hover:scale-105 transition duration-300'
      />

      {/* Overlay */}
      <div className='absolute font-semibold inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end justify-between p-3'>
        <span className='text-white text-xs'>{image.title}</span>
        <Eye className='text-white w-4 h-4' />
      </div>
    </div>
  );
};

export default ImageCard;
