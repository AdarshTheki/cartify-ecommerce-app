import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Sheet, Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks';
import { Input, LazyImage } from '../../components';
import { socialFormats } from '../../utils';
import GalleryCard from './GalleryCard';

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] =
    useState<keyof typeof socialFormats>('Instagram Square (1:1)');
  const { callApi, loading, data, setData } = useApi<CloudinaryFileType>();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0] as File;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image?.name) return toast.error('upload image not found');
    const result = await callApi('/cloudinary', 'POST', { file: image });
    if (result) {
      setData(result);
      setImage(null);
      setPreview(null);
    }
  }

  return (
    <div className='mb-12 max-w-sm'>
      <h2 className='text-xl font-medium'>Upload Image</h2>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Input
          id='fileInput'
          type='file'
          accept='image/*'
          placeholder='upload'
          className='hidden'
          onChange={handleImageChange}
        />

        {!preview && (
          <label
            htmlFor='fileInput'
            className='border bg-white rounded-md text-sm w-full max-w-80 border-indigo-600/60 p-8 flex flex-col items-center gap-4  cursor-pointer hover:border-indigo-500 transition'>
            <Sheet />
            <p className='text-gray-500'>Drag & drop your files here</p>
            <p className='text-gray-400'>
              Or <span className='text-indigo-500 underline'>click</span> to upload
            </p>
            <input id='fileInput' type='file' className='hidden' />
          </label>
        )}

        {!!preview && (
          <div className='w-full relative'>
            <LazyImage src={preview} alt={`file_preview`} className='w-full h-full' />
            <button
              className='btn !p-1 btn-secondary absolute top-1 right-1'
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              type='button'>
              <Trash2Icon />
            </button>
          </div>
        )}

        {!!image?.name && (
          <button
            disabled={loading || !image}
            type='submit'
            className='btn !bg-green-600 !text-white !disabled:cursor-none'>
            {loading ? 'loading...' : `Upload`}
          </button>
        )}
      </form>

      <div className='flex flex-col gap-2'>
        {!!data?.secure_url && (
          <label htmlFor='selection'>
            <p className='pb-2 font-medium'>Social Size:</p>
            <select
              className='peer border cursor-pointer border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-1.5'
              id='selection'
              onChange={(e) => setSelectedFormat(e.target.value as keyof typeof socialFormats)}
              value={selectedFormat}>
              {Object.keys(socialFormats).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}

        {!!data?.secure_url && (
          <GalleryCard
            {...data}
            secure_url={
              data?.secure_url?.split('/upload').length
                ? data?.secure_url
                    .split('/upload')
                    .join(
                      `/upload/w_${socialFormats[selectedFormat].width},h_${socialFormats[selectedFormat].height},ar_${socialFormats[selectedFormat].aspectRatio},c_fill`,
                    )
                : data?.secure_url
            }
            onDelete={() => {
              setData(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
