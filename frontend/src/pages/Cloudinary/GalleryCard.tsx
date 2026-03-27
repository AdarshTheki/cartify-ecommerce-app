import { Download, Folder, Globe2Icon, Image as ImageIcon, Loader, Trash2Icon } from 'lucide-react';
import { useApi } from '../../hooks';
import { errorHandler } from '../../services';
import { Button } from '../../components';
import { useAppSelector } from '../../store/store';
import type { Image } from '../../types';

const GalleryCard = ({
  url,
  publicId,
  title,
  format,
  size,
  height,
  width,
  onDelete,
}: Image & { onDelete: () => void }) => {
  const { callApi, loading } = useApi();
  const { user } = useAppSelector((state) => state.auth);

  const handleDownload = () => {
    if (!url) return;
    // download image on current page
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `download.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  const handleDelete = async () => {
    try {
      const result = await callApi('/cloudinary', 'DELETE', { imageUrl: url });
      if (result) {
        onDelete();
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className='relative w-full rounded-xl overflow-hidden shadow-xl'>
      <a href={url} target='_blank'>
        <img src={url} alt={publicId} className='w-full' />
      </a>
      <div className='flex items-center justify-between absolute top-2 px-2 w-full'>
        <Button
          onClick={handleDownload}
          icon={<Download size={16} />}
          className='text-white bg-slate-800 border-none'
        />
        {user && user?.role === 'admin' && (
          <Button
            disabled={loading}
            onClick={handleDelete}
            icon={loading ? <Loader size={16} /> : <Trash2Icon size={16} />}
            className='text-red-600 !border-red-600'
          />
        )}
      </div>
      <div className='py-2 px-4 space-y-2 bg-white'>
        <p className='text-sm font-medium'>{title}</p>
        <div className='flex gap-2 text-xs items-center border-b border-gray-300'>
          <Folder size={14} /> Folder Name
        </div>
        <div className='flex flex-wrap gap-1 items-center justify-between text-xs'>
          <div className='flex gap-2 items-center'>
            <ImageIcon size={14} />
            {format}
          </div>
          <span>{(Number(size) / 1024).toFixed(0)} kb</span>
          <span>
            {width}x{height}
          </span>
          <Globe2Icon size={14} />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
