import { useState } from 'react';
import { Download, X } from 'lucide-react';
import type { Image } from '../../types';
import { cn } from '../../utils';

const socialSizesOptions = [
  { name: 'Instagram Square (1:1)', effect: 'w_1080,h_1080,ar_1:1' },
  { name: 'Instagram Portrait (4:5)', effect: 'w_1080,h_1350,ar_4:5' },
  { name: 'Twitter Post (16:9)', effect: 'w_1200,h_675,ar_16:9' },
  { name: 'Twitter Header (3:1)', effect: 'w_1500,h_500,ar_3:1' },
  { name: 'Facebook Cover (205:78)', effect: 'w_820,h_312,ar_205:78' },
];

const transformationOptions = [
  { name: 'Grayscale', effect: 'e_grayscale' },
  { name: 'Oil Painting', effect: 'e_oil_paint' },
  { name: 'Cartoonify', effect: 'e_cartoonify' },
  { name: 'Blur (600)', effect: 'e_blur:600' },
  { name: 'Blur Faces', effect: 'e_blur_faces:800' },
  { name: 'Pixelate Faces', effect: 'e_pixelate_faces:18' },
  { name: 'Sepia', effect: 'e_sepia' },
  { name: 'Remove Background', effect: 'e_background_removal' },
];

interface ModalProps {
  image: Image | null;
  onClose: () => void;
}

type Transform = {
  name: string;
  effect: string;
};

export default function ImageModal({ image, onClose }: ModalProps) {
  const [transforms, setTransforms] = useState<Transform[]>([]);

  if (!image) return null;

  const getUrl = () => {
    if (!transforms.length) return image.url;
    const parts = image.url.split('/upload/');
    return `${parts[0]}/upload/${transforms.map((t) => t.effect).join(',')}/${parts[1]}`;
  };

  const handleTransforms = (transform: Transform) => {
    setTransforms((prev) =>
      prev && prev.find((i) => i.name === transform.name)
        ? prev.filter((i) => i.name !== transform.name)
        : [...prev, transform],
    );
  };

  return (
    <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center sm:p-4'>
      {/* Overlay click close */}
      <div className='absolute inset-0' onClick={onClose} />

      {/* Modal Content */}
      <div className='relative bg-white w-full max-sm:h-[95%] max-sm:w-[95%] max-w-3xl overflow-y-auto rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2'>
        {/* Image Section */}
        <div className='bg-white p-2'>
          <div className='w-full mx-auto flex items-center justify-center h-full'>
            <img src={getUrl()} className='w-full object-contain' />
          </div>
        </div>

        {/* Controls */}
        <div className='p-4 flex flex-col gap-4'>
          {/* Header */}
          <div className='flex justify-between items-center'>
            <a
              href={image.url}
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold truncate'>
              {image.publicId}
            </a>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Transformations */}
          <div>
            <p className='text-sm font-medium'>Transformations</p>
            <div className='flex flex-wrap gap-3 mt-2'>
              {transformationOptions.map((trans) => (
                <button
                  key={trans.name}
                  className={cn(
                    'px-3 py-1 text-sm border rounded-lg hover:bg-black hover:text-white transition',
                    transforms.find((i) => i.name === trans.name) ? 'bg-black text-white' : '',
                  )}
                  onClick={() => handleTransforms(trans)}>
                  {trans.name}
                </button>
              ))}
            </div>
          </div>

          {/* Social Sizes */}
          <div>
            <h3 className='text-sm font-medium mb-2'>Social Sizes</h3>
            <div className='flex flex-wrap gap-2'>
              {socialSizesOptions.map((option) => (
                <button
                  key={option.name}
                  className={cn(
                    'px-3 py-1 text-sm border rounded-lg hover:bg-black hover:text-white transition',
                    transforms.find((i) => i.name === option.name) ? 'bg-black text-white' : '',
                  )}
                  onClick={() => handleTransforms(option)}>
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className='mt-auto flex gap-2'>
            <a
              target='_blank'
              href={getUrl()}
              download
              className='flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-black/80'>
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
