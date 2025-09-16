import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Textarea } from './ui';
import { Loader, Sparkle, Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { errorHandler, axiosInstance } from '@/lib/utils';
import { Select } from '@/components/ui';
import useTitle from '../hooks/useTitle';

const CategoryForm = ({ item }: { item?: CategoryType }) => {
  const { pathname } = useLocation();
  const path = pathname.split('/')[1];
  const navigate = useNavigate();

  useTitle(`Cartify: ${item?._id ? `Update ${path}` : `Add New ${path}`}`);

  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    status: item?.status || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(item?.thumbnail || '');
  const [loading, setLoading] = useState(false);
  const [AILoading, setAILoading] = useState(false);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement & HTMLSelectElement
  > = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: value });

    if (files && files.length > 0) {
      setImage(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleDescriptionGenerate = async () => {
    try {
      if (formData.description.length < 50)
        return toast.error('AI to enter at least 50 char entered');
      setAILoading(true);
      const res = await axiosInstance.post('/openai/generate-text', {
        userText: formData.description,
        prompt: `
        You are an expert in eCommerce product classification. 
        Analyze the given text (product name or description) and generate a best category description of eCommerce app 
        
        Input:  
        - text: ${formData.description}  
        
        Rules:  
        1. Choose the single best-matching category.  
        2. If unclear, provide the **closest possible category** (don’t leave blank).  
        3. Do not invent new categories — only pick from the list.  
        4. Return only the category name.  
        `,
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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.status) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('status', formData.status);

      if (image?.name) payload.append('thumbnail', image);

      const endpoint = `/${path}${item?._id ? `/${item._id}` : ''}`;
      const method = item?._id ? 'patch' : 'post';

      const response = await axiosInstance[method](endpoint, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        navigate(`/${path}`);
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* item form data */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-gray-700 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-700 capitalize">{path}</h2>
        <div className="flex gap-5 max-sm:flex-col sm:items-end">
          <Input
            name="title"
            className="w-full"
            required={true}
            value={formData.title}
            onChange={handleChange}
          />
          <Select
            className="right-0"
            list={['active', 'inactive']}
            onSelected={(e: string) => setFormData({ ...formData, status: e })}
            selected={formData.status || 'select status'}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            name="description"
            id="description"
            placeholder="Generate a e-commerce description with title of title with 500 to 1000 char."
            required={true}
            maxLength={1000}
            rows={5}
          />
          <small className="text-gray-500">
            {formData.description.length} char, If you generate description with
            AI to enter at least 50 char entered.
          </small>
          <button
            onClick={handleDescriptionGenerate}
            type="button"
            disabled={AILoading}
            className="text-xs flex items-center gap-1 px-6 w-fit py-2 rounded-full hover:bg-gray-100 text-gray-800 border border-gray-800 font-semibold duration-300">
            {AILoading ? <Loader /> : <Sparkle size={14} />}
            Generate AI
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
            {preview?.length ? null : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <label htmlFor="upload-multi-files">
                        Upload single image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-multi-files"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to{' '}
                    <span className="text-red-600">5MB</span>
                  </p>
                </div>
              </div>
            )}
          </label>

          {preview && (
            <div className="relative w-full max-w-[400px] p-1">
              <img
                src={preview}
                alt="thumbnail"
                className="object-cover w-full max-h-[200px]"
              />
              <button
                type="button"
                className="svg-btn text-red-600 absolute top-1 right-1 cursor-pointer">
                <Trash2
                  size={18}
                  strokeWidth={2}
                  onClick={() => {
                    setPreview('');
                    setImage(null);
                  }}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-5 pt-10">
          <button
            onClick={() => navigate(`/${path}`)}
            type="button"
            className="border text-gray-800 border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 duration-300">
            Cancel
          </button>
          <button className="bg-gray-800 border border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300">
            {loading ? 'Loading...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
