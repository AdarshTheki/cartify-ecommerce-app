import Markdown from 'react-markdown';
import { useState } from 'react';
import { Sparkles, Copy, RefreshCcw } from 'lucide-react';

import { useApi, useTypewriter } from '../../hooks';
import { cn } from '../../utils';

const categories = [
  'General',
  'Technology',
  'Business',
  'Health',
  'Lifestyle',
  'Education',
  'Travel',
  'Food',
];

const TextGenerator = () => {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(categories[0]);
  const { loading, data, callApi, setData } = useApi<{ response: string }>();
  const { displayText } = useTypewriter({ text: data?.response || '', speed: 5 });

  const handleSubmit = async () => {
    const prompt = `
    You are a smart AI assistant.

    Write response in:
    - Short lines
    - Simple words
    - Bullet points or small paragraphs

    Rules:
    - No long paragraphs
    - Keep it clean and easy
    - Focus on key points only
    - Avoid fluff and repetition
    - Under 150 to 200 words

    Topic:
    ${input} & category is ${selected}`;

    const result = await callApi('/openai/generate-text', 'POST', {
      prompt: prompt,
      userText: input,
    });
    if (result) {
      setData(result);
      setSelected(categories[0]);
      setInput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.response || '');
  };

  return (
    <div className='gap-4 p-4 grid sm:grid-cols-2'>
      {/* LEFT PANEL */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className='card !px-5 flex-1 space-y-5'>
        <div className='flex items-center gap-2'>
          <Sparkles className='text-[#3588F2]' />
          <h2 className='text-lg font-semibold'>AI Text Generator</h2>
        </div>

        <label htmlFor='ai-input' className='font-medium text-sm'>
          Describe Your Content
        </label>
        <textarea
          rows={4}
          name='ai-input'
          id='ai-input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            'Write something like: Generate a blog intro about the benefits of meditation...'
          }
          className={`w-full text-sm p-2 px-5 rounded-lg border outline-none !border-[#3588F2]`}></textarea>

        {/* CATEGORY */}
        <div>
          <p className='text-sm font-medium mb-2'>Category</p>
          <div className='flex flex-wrap gap-2'>
            {categories.map((item) => (
              <button
                type='button'
                key={item}
                onClick={() => setSelected(item)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full transition',
                  selected === item
                    ? 'bg-[#3588F2] text-white shadow'
                    : 'bg-gray-100 hover:bg-gray-200',
                )}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <button
          type='submit'
          disabled={loading || !input.trim()}
          className='w-full flex items-center justify-center gap-2 bg-[#3588F2] text-white py-2.5 rounded-xl hover:bg-[#3588F2] transition'>
          {loading ? (
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? 'Generating...' : 'Generate Text'}
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div className='flex flex-col card !px-5 flex-1 space-y-5'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-[#3588F2]' />
            <h2 className='text-lg font-semibold'>AI Text Response</h2>
          </div>

          {data?.response && (
            <div className='flex gap-2'>
              <button onClick={handleCopy} className='p-2 hover:bg-gray-100 rounded-lg'>
                <Copy size={16} />
              </button>

              <button onClick={() => setData(null)} className='p-2 hover:bg-gray-100 rounded-lg'>
                <RefreshCcw size={16} />
              </button>
            </div>
          )}
        </div>

        {/* OUTPUT */}
        <div className='flex-1 overflow-y-auto text-sm text-gray-700'>
          {loading && (
            <div className='space-y-2 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-4 bg-gray-200 rounded w-full' />
              <div className='h-4 bg-gray-200 rounded w-5/6' />
            </div>
          )}

          {!loading && data?.response && (
            <div className='reset-tw'>
              <Markdown>{displayText}</Markdown>
            </div>
          )}

          {!loading && !data?.response && (
            <div className='text-center text-gray-400 mt-10'>
              ✨ Your AI-generated content will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextGenerator;
