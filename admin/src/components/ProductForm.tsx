import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Sparkles, Trash2 } from 'lucide-react';

import { Input, Textarea } from './ui';

import { toast } from 'react-toastify';
import useTitle from '../hooks/useTitle';
import { AxiosError } from 'axios';
import {
  errorHandler,
  axiosInstance,
  categories,
  brands,
  productStatus,
} from '@/lib/utils';
import { Select } from './ui';

const ProductForm = ({ data }: { data?: ProductType }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [AILoading, setAILoading] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    data?.images.length ? data?.images : []
  );
  useTitle(`Cartify: ${data?._id ? 'Update Product' : 'Add New Product'}`);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(data?.thumbnail || '');

  const [formData, setFormData] = useState({
    title: data?.title || '',
    category: data?.category || '',
    brand: data?.brand || '',
    status: data?.status || '',
    description: data?.description || '',
    discount: data?.discount,
    price: data?.price,
    rating: data?.rating,
    stock: data?.stock,
  });

  interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleImageChange = (event: ImageChangeEvent) => {
    const files = event.target.files as FileList;
    setImages(Array.from(files));
    setPreviews(
      Array.from(files).map((file: File) => URL.createObjectURL(file))
    );
  };

  const removeImage = (id: number) => {
    setPreviews(previews.filter((_, index) => index !== id));
    setImages(images.filter((_, index) => index !== id));
  };

  const handleThumbnailChange = (event: ImageChangeEvent) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Validation

    if (Number(thumbnail?.size || 1) > 5 * 1024 * 1024) {
      toast.error('Upload thumbnail upto 5MB');
      setLoading(false);
      return;
    }

    if (images.reduce((p, c) => p + c.size, 0) > 10 * 1024 * 1024) {
      toast.error('Upload gallery upto 10MB');
      setLoading(false);
      return;
    }

    if (
      !formData.title ||
      !formData.category ||
      !formData.brand ||
      !formData.description ||
      !formData.status ||
      !formData.discount ||
      !formData.price ||
      !formData.rating ||
      !formData.stock
    ) {
      setLoading(false);
      toast.error('Please fill all the fields');
      return;
    }

    // Prepare FormData
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('category', formData.category);
    uploadData.append('brand', formData.brand);
    uploadData.append('description', formData.description);
    uploadData.append('discount', formData.discount.toString());
    uploadData.append('price', formData.price.toString());
    uploadData.append('rating', formData.rating.toString());
    uploadData.append('stock', formData.stock.toString());
    uploadData.append('status', formData.status);
    if (thumbnail) uploadData.append('thumbnail', thumbnail);
    images.forEach((image) => uploadData.append('images', image));

    // API Call
    try {
      const endpoint = data?._id ? `/product/${data._id}` : '/product';
      const method = data?._id ? 'patch' : 'post';
      const res = await axiosInstance[method](endpoint, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data) {
        navigate('/product');
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionGenerate = async () => {
    try {
      if (formData.description.length < 50)
        return toast.error('AI to enter at least 50 char entered');
      setAILoading(true);
      const res = await axiosInstance.post('/openai/generate-text', {
        userText: formData.description,
        prompt: `Generate a e-commerce product description under 1000 characters simple text formate of this context "${formData.description}"`,
      });
      if (res.data.data) {
        setFormData({ ...formData, description: res.data.data.response });
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setAILoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handelSubmit}>
        <h3 className="text-xl font-semibold mb-10">
          {data?._id ? 'Update Product' : 'Add New Product'}
        </h3>
        <div className="space-y-4">
          <Input
            required
            name="title"
            type="text"
            onChange={handleChange}
            value={formData?.title}
          />
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-5 py-1">
            <Select
              onSelected={(e: string) =>
                setFormData({ ...formData, category: e })
              }
              list={categories}
              selected={formData.category || 'select category'}
            />
            <Select
              onSelected={(e: string) => setFormData({ ...formData, brand: e })}
              list={brands}
              selected={formData.brand || 'select brand'}
            />
            <Select
              onSelected={(e: string) =>
                setFormData({ ...formData, status: e })
              }
              list={productStatus}
              selected={formData.status || 'select status'}
            />
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-5">
            <Input
              placeholder="Discount in %"
              name="discount"
              type="number"
              onChange={handleChange}
              value={formData?.discount}
            />

            <Input
              placeholder="Price in $"
              name="price"
              type="number"
              onChange={handleChange}
              value={formData.price}
            />

            <Input
              placeholder="Rating up to 5"
              name="rating"
              type="number"
              max={5}
              onChange={handleChange}
              value={formData.rating}
            />

            <Input
              placeholder="Stock"
              name="stock"
              type="number"
              max={51}
              onChange={handleChange}
              value={formData.stock}
            />
          </div>
          <div className="flex gap-1 flex-col">
            <Textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              value={formData.description}
              name="description"
              rows={5}
              placeholder="Please enter a description char between 100 to 1000"
              maxLength={1000}
              minLength={100}
            />

            <small className="text-gray-500">
              {formData.description.length} char, If you generate description
              with AI to enter at least 50 char entered.
            </small>
            <button
              onClick={handleDescriptionGenerate}
              type="button"
              disabled={AILoading}
              className="text-xs flex items-center gap-1 px-6 w-fit py-2 rounded-full hover:bg-gray-100 text-gray-800 border border-gray-800 font-semibold duration-300">
              {AILoading ? <Loader size={14} /> : <Sparkles size={14} />}
              Generate AI
            </button>
          </div>

          {/* select images */}
          <label className="block text-sm font-medium text-gray-700">
            Product Gallery Images
            {previews?.length ? null : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <label htmlFor="upload-multi-files">
                        Upload multiple files
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-multi-files"
                        onChange={handleImageChange}
                        multiple
                        className="sr-only"
                      />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to{' '}
                    <span className="text-red-600">10MB</span>
                  </p>
                </div>
              </div>
            )}
          </label>

          {/* show previews */}
          {previews.length ? (
            <div className="flex flex-wrap">
              {previews?.map((preview, index) => (
                <div key={index} className="relative sm:w-1/3 w-1/2 p-1">
                  <img
                    key={index}
                    src={preview}
                    alt={`Image ${index + 1}`}
                    className="object-cover w-full md:h-[15vw] h-[25vw]"
                  />
                  <button
                    type="button"
                    className="svg-btn text-red-600 absolute top-1 right-1 cursor-pointer">
                    <Trash2
                      size={18}
                      strokeWidth={2}
                      onClick={() => removeImage(index)}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700">
              Product thumbnail
            </label>
            {/* show preview */}
            {preview ? (
              <div className="relative sm:w-1/3 w-full p-1">
                <img
                  src={preview}
                  alt="thumbnail"
                  className="object-cover w-full max-h-[200px] h-[50vw]"
                />
                <button
                  type="button"
                  className="svg-btn text-red-600 absolute top-1 right-1 cursor-pointer">
                  <Trash2
                    size={18}
                    strokeWidth={2}
                    onClick={() => {
                      setPreview(null);
                      setThumbnail(null);
                    }}
                  />
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload single file</span>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    PNG, JPG, GIF up to{' '}
                    <span className="text-red-600">5MB</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/product')}
            className="px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-100 duration-300">
            Cancel
          </button>
          <button className="bg-gray-800 border border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300">
            {loading ? 'Loading...' : 'Save Product'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
