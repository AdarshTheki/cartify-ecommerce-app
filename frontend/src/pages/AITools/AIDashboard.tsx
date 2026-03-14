import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Sparkles, Trash2Icon } from 'lucide-react';
import Markdown from 'react-markdown';
import { useApi } from '../../hooks';
import { formateTime } from '../../utils';
import { Loading } from '../../components/ui';
import { useAppSelector } from '../../redux/store';
import { axiosInstance, errorHandler } from '../../services';

const AIDashboard = () => {
  const [selectedArticle, setSelectedArticle] = useState('');
  const { callApi, data, loading, setData } = useApi<AIResponseType[]>();

  useEffect(() => {
    callApi('/openai/generate-text');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletePost = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/openai/post/${id}`);
      if (res.data) {
        setData((prev) => (prev ? prev.filter((i) => i._id !== id) : []));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className='mx-auto container p-4 space-y-5'>
      <div className='card flex items-center sm:w-84 !px-6'>
        <div className='text-lg font-medium space-y-2 w-full'>
          <p className='text-xl font-medium'>Total Creations</p>
          <p>{data?.length}</p>
        </div>
        <div className='p-2 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
          <Sparkles className='w-6 h-6' />
        </div>
      </div>

      {/* Recent Creations */}
      <p>Recent Creations</p>

      <div className='flex flex-col gap-5'>
        {!loading ? (
          data?.map((item) => (
            <DashboardCard
              key={item._id}
              isActive={item._id === selectedArticle}
              onActive={() => setSelectedArticle((prev) => (prev === item._id ? '' : item._id))}
              onDelete={() => handleDeletePost(item._id)}
              item={item}
            />
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default AIDashboard;

type DashboardCardProps = {
  isActive: boolean;
  onActive: () => void;
  item: AIResponseType;
  onDelete: () => void;
};

const DashboardCard = ({ isActive, onActive, item, onDelete }: DashboardCardProps) => {
  const { user } = useAppSelector((s) => s.auth);
  const [isLiked, setIsLiked] = useState(user?._id ? item?.likes.includes(user._id) : false);
  const [likes, setLikes] = useState(item?.likes?.length);

  const handleLikeToggle = async () => {
    try {
      setIsLiked(!isLiked);
      const res = await axiosInstance.post(`/openai/like/${item._id}`);
      if (res.data?.data) {
        setLikes(res.data?.data?.totalLikes);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className='card w-full !p-2' key={item?._id}>
      <div
        onClick={onActive}
        className='w-full rounded-lg p-2 flex justify-between gap-2 items-center hover:bg-gray-100 duration-150 cursor-pointer'>
        <div className='flex flex-col gap-1'>
          <p className={`font-medium ${isActive ? '' : 'line-clamp-1'}`}>{item?.prompt}</p>
          <div className='text-xs'>
            <span className='lowercase pr-4'>#{item?.model}</span>
            {formateTime(item?.createdAt)}
          </div>
        </div>
        <button>{isActive ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button>
      </div>

      <div className='flex items-center py-2 gap-5'>
        <button
          onClick={handleLikeToggle}
          className='flex gap-2 items-center hover:bg-gray-200 cursor-pointer shadow border rounded-full py-2 px-4 border-gray-300 text-sm'>
          <Heart
            size={16}
            className={`text-red-600`}
            fill={isLiked ? 'oklch(57.7% 0.245 27.325)' : '#fff'}
          />
          Likes {likes}
        </button>
        <button
          className='flex gap-2 items-center hover:bg-gray-200 cursor-pointer shadow border rounded-full py-2 px-4 border-gray-300 text-sm'
          onClick={onDelete}>
          <Trash2Icon size={16} className='text-indigo-700' />
          Delete
        </button>
      </div>

      {isActive && item?.model !== 'text-to-image' && (
        <div className='p-2 w-full text-sm'>
          <div className='reset-tw'>
            <Markdown>{item?.response}</Markdown>
          </div>
        </div>
      )}

      {isActive && item?.model === 'text-to-image' && (
        <img src={item?.response} alt='model_Pic' className='w-full' />
      )}
    </div>
  );
};
