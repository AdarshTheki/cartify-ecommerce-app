import { useState } from 'react';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import { ChevronDown, ChevronUp, Heart, Trash2Icon } from 'lucide-react';
import { useSelector } from 'react-redux';

import { axios, errorHandler } from '../../config';

const DashboardCard = ({ isActive, onActive, item, onDelete }) => {
  const { user } = useSelector((s) => s.auth);
  const [isLiked, setIsLiked] = useState(item?.likes.includes(user._id));
  const [likes, setLikes] = useState(item?.likes?.length);

  const handleLikeToggle = async () => {
    try {
      setIsLiked(!isLiked);
      const res = await axios.post(`/openai/like/${item._id}`);
      if (res.data?.data) {
        setLikes(res.data?.data?.totalLikes);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="card w-full !p-2" key={item?._id}>
      <div
        onClick={onActive}
        className="w-full rounded-lg p-2 flex justify-between gap-2 items-center hover:bg-gray-100 duration-150 cursor-pointer">
        <div className="flex flex-col gap-1">
          <p className={`font-medium ${isActive ? '' : 'line-clamp-1'}`}>
            {item?.prompt}
          </p>
          <div className="text-gray-500 text-xs">
            <span className="lowercase pr-4">#{item?.model}</span>
            {format(new Date(item?.createdAt), 'dd MMM yyyy, h:mm a')}
          </div>
        </div>
        <button>
          {isActive ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      <div className="flex items-center py-2 gap-5">
        <button
          onClick={handleLikeToggle}
          className="flex gap-2 items-center hover:bg-gray-200 cursor-pointer shadow border rounded-full py-2 px-4 border-gray-300 text-sm">
          <Heart
            size={16}
            className={`text-red-600`}
            fill={isLiked ? 'oklch(57.7% 0.245 27.325)' : '#fff'}
          />
          Likes {likes}
        </button>
        <button
          className="flex gap-2 items-center hover:bg-gray-200 cursor-pointer shadow border rounded-full py-2 px-4 border-gray-300 text-sm"
          onClick={onDelete}>
          <Trash2Icon size={16} className="text-indigo-700" />
          Delete
        </button>
      </div>

      {isActive && item?.model !== 'text-to-image' && (
        <div className="p-2 w-full text-sm">
          <div className="reset-tw">
            <Markdown>{item?.response}</Markdown>
          </div>
        </div>
      )}

      {isActive && item?.model === 'text-to-image' && (
        <img src={item?.response} alt="model_Pic" className="w-full" />
      )}
    </div>
  );
};

export default DashboardCard;
