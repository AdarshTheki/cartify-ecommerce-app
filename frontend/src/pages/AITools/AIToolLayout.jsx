import { Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import useTypewriter from '../../../../client/src/hooks/useTypewriter';

const AIToolLayout = ({
  aiTool,
  styleData,
  handleSubmit,
  input,
  setInput,
  selected,
  setSelected,
  loading,
  data,
}) => {
  const { displayText } = useTypewriter({
    text: data?.response || '',
    speed: 10,
  });

  return (
    <div className='gap-4 p-4 grid sm:grid-cols-2'>
      {/* Left Create Form */}
      <form
        className='card !px-5 flex-1 space-y-5'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <div className='flex gap-2 items-center'>
          <Sparkles className={`w-6 h-6`} style={{ color: aiTool.bg.from }} />
          <p className='font-medium'>{aiTool.title}</p>
        </div>
        <label htmlFor='ai-input' className='font-medium text-sm'>
          {aiTool.inputLabel}
        </label>
        <input
          name='ai-input'
          id='ai-input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={aiTool.placeholder}
          className='w-full text-sm p-2 px-5 rounded-lg border outline-none'
          style={{ borderColor: aiTool.bg.from }}
        />

        <div>
          <p className='text-sm font-medium'>{aiTool.styleLabel}</p>
          <div className='flex flex-wrap gap-3 mt-2'>
            {styleData.map((style, i) => (
              <button
                type='button'
                key={i}
                onClick={() => setSelected(style)}
                style={
                  selected === style
                    ? {
                        border: `1px solid ${aiTool.bg.from}`,
                        color: aiTool.bg.from,
                      }
                    : { border: '1px solid #aaa' }
                }
                className='rounded-2xl text-nowrap w-fit text-xs px-4 py-1 text-gray-600'>
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
          className='py-2 mt-8 hover:opacity-85 flex text-white rounded-full items-center justify-center gap-2 !text-sm w-full'>
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5'></div>
            </div>
          ) : (
            <aiTool.Icon className='w-4 h-4' />
          )}
          {aiTool.title}
        </button>
      </form>

      {/* Right Generate Content */}
      <div className='card !px-5 flex-1'>
        <div className='flex gap-2 items-center'>
          <aiTool.Icon
            className='lucide lucide-square-pen w-7 h-7 p-1 text-white rounded-xl'
            style={{
              background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to}`,
            }}
          />
          <p className='font-medium'>{aiTool.title}</p>
        </div>
        {!data?.response ? (
          <div className='min-h-[300px] h-full text-center flex items-center justify-center flex-col'>
            <aiTool.Icon className='w-12 h-12 mx-auto mb-4 text-gray-400' />
            <small className='text-gray-400'>
              Enter a topic and click “{aiTool.title}” to get started
            </small>
          </div>
        ) : (
          <div className='mt-3 overflow-y-auto text-sm text-slate-600'>
            <div className='reset-tw'>
              <Markdown>{displayText}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolLayout;
