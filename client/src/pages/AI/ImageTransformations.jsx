import React, { useState } from 'react';
import { Sparkles, Trash2, Wand2 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { AiToolsData } from '../../assets';

const ImageTransformations = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTransformations, setSelectedTransformations] = useState([]);
  const { loading, data, callApi, setData } = useApi();
  const [endpoint, setEndpoint] = useState('/cloudinary/image-effect');

  const aiTool = {
    ...AiToolsData[3],
  };

  const transformationOptions = [
    { name: 'Grayscale', value: { effect: 'grayscale' } },
    { name: 'Oil Painting', value: { effect: 'oil_paint' } },
    { name: 'Cartoonify', value: { effect: 'cartoonify' } },
    { name: 'Blur (300)', value: { effect: 'blur:300' } },
    { name: 'Pixelate Faces', value: { effect: 'pixelate_faces' } },
    { name: 'Sepia', value: { effect: 'sepia' } },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setData(null);
    }
  };

  const toggleTransformation = (transformationValue) => {
    setSelectedTransformations((prev) => {
      const isSelected = prev.some(
        (t) => JSON.stringify(t) === JSON.stringify(transformationValue)
      );
      if (isSelected) {
        return prev.filter(
          (t) => JSON.stringify(t) !== JSON.stringify(transformationValue)
        );
      } else {
        return [...prev, transformationValue];
      }
    });
  };

  const handleTransformationSubmit = async () => {
    if (loading) return;
    if (!image) {
      return toast.error('Please upload an image first.');
    }

    const formData = new FormData();
    formData.append('image', image);

    if (endpoint === '/cloudinary/remove-object') {
      if (!prompt) {
        return toast.error('Please enter a prompt to remove an object.');
      }
      formData.append('prompt', prompt);
    } else {
      if (selectedTransformations.length === 0) {
        return toast.error('Please select at least one transformation.');
      }
      formData.append(
        'transformations',
        JSON.stringify(selectedTransformations)
      );
    }

    const result = await callApi(endpoint, formData);
    if (result) {
      setData(result);
    }
  };

  return (
    <div className="gap-4 p-4 grid sm:grid-cols-2">
      {/* Left Form */}
      <div className="card !px-5 flex-1 space-y-5 !w-full">
        <div className="flex gap-2 items-center">
          <Sparkles className={`w-6 h-6`} style={{ color: aiTool.bg.from }} />
          <p className="font-medium">{aiTool.title}</p>
        </div>

        <div>
          <label htmlFor="ai-image-transform" className="font-medium text-sm">
            Upload Image
          </label>
          <input
            id="ai-image-transform"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm p-2 px-5 rounded-lg border outline-none"
            style={{ borderColor: aiTool.bg.from }}
          />
        </div>

        {previewUrl && (
          <div>
            <p className="font-medium text-sm mb-2">Image Preview</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg max-h-60 w-auto"
            />
          </div>
        )}

        <div className="flex flex-col items-start gap-2">
          <label
            className="text-sm flex gap-1 items-center capitalize"
            htmlFor="/cloudinary/image-effect">
            <input
              type="radio"
              name="/cloudinary/image-effect"
              id="/cloudinary/image-effect"
              checked={endpoint === '/cloudinary/image-effect'}
              value="/cloudinary/image-effect"
              onChange={(e) => setEndpoint(e.target.value)}
            />
            image effect
          </label>
          <label
            className="text-sm flex gap-1 items-center capitalize"
            htmlFor="/cloudinary/remove-object">
            <input
              type="radio"
              name="/cloudinary/remove-object"
              id="/cloudinary/remove-object"
              checked={endpoint === '/cloudinary/remove-object'}
              value="/cloudinary/remove-object"
              onChange={(e) => setEndpoint(e.target.value)}
            />
            remove object
          </label>
          <label
            className="text-sm flex gap-1 items-center capitalize"
            htmlFor="/cloudinary/remove-background">
            <input
              type="radio"
              name="/cloudinary/remove-background"
              id="/cloudinary/remove-background"
              checked={endpoint === '/cloudinary/remove-background'}
              value="/cloudinary/remove-background"
              onChange={(e) => setEndpoint(e.target.value)}
            />
            remove background
          </label>
        </div>

        <div>
          <p className="text-sm font-medium">Select Transformations</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {transformationOptions.map((trans, i) => (
              <button
                type="button"
                key={i}
                onClick={() => toggleTransformation(trans.value)}
                style={
                  selectedTransformations.some(
                    (t) => JSON.stringify(t) === JSON.stringify(trans.value)
                  )
                    ? {
                        border: `1px solid ${aiTool.bg.from}`,
                        color: aiTool.bg.from,
                      }
                    : { border: '1px solid #aaa' }
                }
                className="rounded-2xl text-nowrap w-fit text-xs px-4 py-1 text-gray-600">
                {trans.name}
              </button>
            ))}
          </div>
        </div>

        {endpoint === '/cloudinary/image-effect' && (
          <button
            disabled={loading}
            onClick={handleTransformationSubmit}
            style={{
              background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to})`,
            }}
            className="py-2 mt-8 hover:opacity-85 flex text-white rounded-full items-center justify-center gap-2 !text-sm w-full">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5"></div>
              </div>
            ) : (
              <aiTool.Icon className="w-4 h-4" />
            )}
            Apply Transformations
          </button>
        )}

        <div className="flex flex-col gap-4">
          {endpoint === '/cloudinary/remove-background' && (
            <button
              disabled={loading}
              onClick={handleTransformationSubmit}
              className="py-2 hover:opacity-85 flex bg-red-500 text-white rounded-full items-center justify-center gap-2 !text-sm w-full">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5"></div>
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Remove Background
                </>
              )}
            </button>
          )}

          {endpoint === '/cloudinary/remove-object' && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a cat, a car"
                className="w-full text-sm p-2 px-5 rounded-lg border outline-none"
              />
              <button
                disabled={loading}
                onClick={() =>
                  handleTransformationSubmit('/cloudinary/remove-object')
                }
                className="py-2 hover:opacity-85 flex bg-purple-500 text-white rounded-full items-center justify-center gap-2 !text-sm w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5"></div>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Remove Object
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="card !px-5 flex-1">
        <div className="flex gap-2 items-center">
          <aiTool.Icon
            className="lucide lucide-square-pen w-7 h-7 p-1 text-white rounded-xl"
            style={{
              background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to})`,
            }}
          />
          <p className="font-medium">Transformed Images</p>
        </div>
        {!data?.response ? (
          <div className="min-h-[300px] h-full text-center flex items-center justify-center flex-col">
            <aiTool.Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <small className="text-gray-400">
              Your transformed images will appear here.
            </small>
          </div>
        ) : (
          <img
            src={data?.response}
            alt="Transformed Image"
            className="w-full rounded-lg shadow-md"
          />
        )}
      </div>
    </div>
  );
};

export default ImageTransformations;
