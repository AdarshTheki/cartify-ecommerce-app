import { useNavigate } from 'react-router-dom';
import { AiToolsData } from '../../assets/assets';

const AITools = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto relative">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-slate-700 text-3xl mb-4 font-semibold">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>

      {/* AI Tools */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 sm:gap-4 gap-2 mt-8">
        {AiToolsData.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="p-8 z-10 w-full bg-white/40 flex gap-4 max-lg:flex-col items-start rounded-lg shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">
            <item.Icon
              className="lucide lucide-square-pen min-w-12 h-12 p-3 text-white rounded-xl"
              style={{
                background: `linear-gradient(to bottom, ${item.bg.from}, ${item.bg.to})`,
              }}
            />
            <div>
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-gray-400 text-sm max-w-[95%]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITools;
