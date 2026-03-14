import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAppSelector } from '../../redux/store';
import { cn } from '../../utils';
import { axiosInstance, errorHandler } from '../../services';

const CommentLiked = ({ reviewId, likes }: { reviewId: string; likes: string[] }) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [like, setLike] = useState(userId ? likes.includes(userId) : false);
  const [totalLike, setTotalLike] = useState(likes.length);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.patch(`/comment/${reviewId}/like`);
      setTotalLike(res.data.data.likes);
      setLike(!like);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={cn('svg-btn text-xs flex gap-1 !w-16', like && 'bg-indigo-200')}>
      <ThumbsUp size={16} /> {totalLike}
    </button>
  );
};

export default CommentLiked;
