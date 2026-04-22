import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Sparkles, Trash2Icon } from 'lucide-react';
import Markdown from 'react-markdown';
import { useApi } from '../../hooks';
import { formateTime } from '../../utils';
import { Button } from '../../components';
import { useAppSelector } from '../../store/store';
import { api, errorHandler } from '../../services';
import { DataState } from '../../components';
import type { AI } from '../../types';

const AIDashboard = () => {
  const [selectedArticle, setSelectedArticle] = useState('');
  const { callApi, data, loading, setData } = useApi<AI[]>();
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    callApi('/openai/posts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletePost = async (id: string) => {
    try {
      const res = await api.delete(`/openai/post/${id}`);
      if (res.data) {
        setData((prev) => (prev ? prev.filter((i) => i._id !== id) : []));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const totalLikes = data?.reduce(
    (prev, curr) => (curr.likes.includes(user?._id || '') ? prev + 1 : prev),
    0,
  );

  return (
    <div className='mx-auto container p-4 space-y-5'>
      <div className='flex flex-wrap gap-5'>
        <div className='card flex items-center sm:w-84 !px-6'>
          <div className='text-lg font-medium space-y-2 w-full'>
            <p className='text-xl font-medium'>Total Creations</p>
            <p>{data?.length}</p>
          </div>
          <div className='p-2 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-6 h-6' />
          </div>
        </div>

        <div className='card flex items-center sm:w-84 !px-6'>
          <div className='text-lg font-medium space-y-2 w-full'>
            <p className='text-xl font-medium'>Your Likes</p>
            <p>{totalLikes}</p>
          </div>
          <div className='p-2 rounded-lg bg-gradient-to-br from-[#fa6bd6] to-[#d70b37] text-white flex justify-center items-center'>
            <Heart className='w-6 h-6' />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <h2 className='font-semibold text-xl'>Recent Creations</h2>
      <DataState data={data} loading={loading} error={''}>
        {(items) => (
          <div className='flex flex-col gap-5'>
            {items.map((item) => {
              const isLiked = user?._id ? item.likes.includes(user._id) : false;
              const isDeleteUser = user?._id ? item.createdBy._id === user._id : false;
              return (
                <DashboardCard
                  key={item._id}
                  isActive={item._id === selectedArticle}
                  userLiked={isLiked}
                  onActive={() => setSelectedArticle((prev) => (prev === item._id ? '' : item._id))}
                  onDelete={() => handleDeletePost(item._id)}
                  item={item}
                  isDeleteUser={isDeleteUser}
                />
              );
            })}
          </div>
        )}
      </DataState>
    </div>
  );
};

export default AIDashboard;

type DashboardCardProps = {
  isActive: boolean;
  userLiked: boolean;
  isDeleteUser: boolean;
  onActive: () => void;
  item: AI;
  onDelete: () => void;
};

const DashboardCard = ({
  isActive,
  onActive,
  item,
  onDelete,
  userLiked,
  isDeleteUser,
}: DashboardCardProps) => {
  const [isLiked, setIsLiked] = useState(userLiked);
  const [likes, setLikes] = useState(item?.likes?.length);

  const handleLikeToggle = async () => {
    try {
      setIsLiked(!isLiked);
      const res = await api.post(`/openai/like/${item._id}`);
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
        <Button
          icon={
            <Heart
              size={16}
              className={`text-red-600`}
              fill={isLiked ? 'oklch(57.7% 0.245 27.325)' : '#fff'}
            />
          }
          text={likes.toString()}
          onClick={handleLikeToggle}
          className='!rounded-full'
        />
        {isDeleteUser && (
          <Button
            icon={<Trash2Icon size={16} className='text-gray-700' />}
            onClick={onDelete}
            className='!rounded-full'
          />
        )}
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
