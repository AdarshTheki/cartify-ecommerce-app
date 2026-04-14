import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useApi } from '../../hooks';
import type { Image } from '../../types';
import { NavLink } from 'react-router-dom';

export default function MultiImageUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const { callApi, setData, data, loading } = useApi<Image[]>();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
    // Here you would typically upload the files to your server
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file); // backend field name
    });
    const result = await callApi('/image/bulk', 'POST', formData, true);
    if (result) {
      setData(result);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(e.target.files);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    await handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full'>
      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition
        ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}>
        <Upload className='w-10 h-10 text-gray-400 mb-3' />
        <p className='text-sm text-gray-600'>Drag & Drop images here or click to upload</p>

        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleUpload}
          className='absolute inset-0 opacity-0 cursor-pointer'
        />
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6'>
          {images.map((src, index) => (
            <div key={index} className='relative group rounded-xl overflow-hidden shadow-md'>
              <img
                src={src}
                alt='preview'
                className='w-full h-40 object-cover group-hover:scale-105 transition duration-300'
              />
              {/* Loading Spinner */}
              {loading && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50 text-white p-1 transition'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeImage(index)}
                className='absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full  transition'>
                <X className='w-4 h-4' />
              </button>

              {/* URL */}
              <div className='absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate '>
                {src}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Grid Urls */}
      {data && data.length > 0 && (
        <div className='my-4 border p-4 rounded-lg bg-gray-50'>
          <h4 className='text-sm font-semibold mb-4'>Image Urls:-</h4>
          <div className='grid gap-4'>
            {data.map((src, index) => (
              <NavLink
                key={index}
                to={src.url}
                target='_blank'
                className='text-sm text-blue-600 hover:underline'>
                {src.url}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
