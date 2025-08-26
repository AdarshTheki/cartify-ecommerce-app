import React, { useState } from 'react';
import { AiToolsData } from '../../assets';
import { Sparkles } from 'lucide-react';
import useApi from '../../hooks/useApi';

const GenerateImage = () => {
  const styleData = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'Fantasy style',
    '3D style',
    'Portrait style',
  ];
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [prompt, setPrompt] = useState('');
  const { data, loading, setData, callApi } = useApi();

  // checkbox = Make this image public
  const aiTool = {
    ...AiToolsData[2],
    inputLabel: 'Describe Your Image',
    placeholder: 'eg., a cute cate playing with a boll of yarn',
    styleLabel: 'Style',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = `
      You are an expert AI image generator. 
      Create a detailed and visually appealing image based on the following inputs:
      Inputs: 
      - Describe Your Image: ${prompt}  
      - Style: ${selectedStyle}  
      Rules:
      1. Always match the requested style. Options: Realistic, Ghibli style, Anime style, Cartoon style, Fantasy style, 3D style, Portrait style.  
      2. Add creative details to make the image vivid and unique while staying true to the description.  
      3. Focus on clarity, composition, and aesthetics.  
      4. Do not add text or watermarks in the image.  
      5. Generate the image in high quality.
    `;

    const result = await callApi('/openai/generate-image', { prompt: payload });
    if (result) {
      setData(result);
      setPrompt('');
      setSelectedStyle(styleData[0]);
    }
  };

  return (
    <div className="gap-4 p-4 grid sm:grid-cols-2">
      {/* Left Create Form */}
      <form className="card !px-5 flex-1 space-y-5" onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center">
          <Sparkles className={`w-6 h-6`} style={{ color: aiTool.bg.from }} />
          <p className="font-medium">{aiTool.title}</p>
        </div>
        <label htmlFor="ai-input" className="font-medium text-sm">
          {aiTool.inputLabel}
        </label>
        <textarea
          rows={4}
          name="ai-input"
          id="ai-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={aiTool.placeholder}
          className="w-full text-sm p-2 px-5 rounded-lg border outline-none"
          style={{ borderColor: aiTool.bg.from }}></textarea>

        <div>
          <p className="text-sm font-medium">{aiTool.styleLabel}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {styleData.map((style, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setSelectedStyle(style)}
                style={
                  selectedStyle === style
                    ? {
                        border: `1px solid ${aiTool.bg.from}`,
                        color: aiTool.bg.from,
                      }
                    : { border: '1px solid #aaa' }
                }
                className="rounded-2xl text-nowrap w-fit text-xs px-4 py-1 text-gray-600">
                {style}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
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
          {aiTool.title}
        </button>
      </form>

      {/* Right Generate Content */}
      <div className="card !px-5 flex-1">
        <div className="flex gap-2 items-center">
          <aiTool.Icon
            className="lucide lucide-square-pen w-7 h-7 p-1 text-white rounded-xl"
            style={{
              background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to}`,
            }}
          />
          <p className="font-medium">{aiTool.title}</p>
        </div>
        {!data?.response ? (
          <div className="min-h-[300px] h-full text-center flex items-center justify-center flex-col">
            <aiTool.Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <small className="text-gray-400">
              Enter a topic and click “{aiTool.title}” to get started
            </small>
          </div>
        ) : (
          <div className="mt-3 overflow-y-auto text-sm text-slate-600">
            <img
              src={data?.response}
              alt="preview_url"
              className="w-full overflow-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImage;
