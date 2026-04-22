import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAppSelector } from '../../store/store';
import { api, errorHandler } from '../../services';

const CommentLiked = ({ reviewId, likes }: { reviewId: string; likes: string[] }) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [like, setLike] = useState(userId ? likes.includes(userId) : false);
  const [totalLike, setTotalLike] = useState(likes.length);

  const handleLike = async () => {
    try {
      const res = await api.patch(`/comment/${reviewId}/like`);
      setTotalLike(res.data.data.likes);
      setLike(!like);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <button onClick={handleLike} className='text-sm flex gap-1 p-2'>
      <Heart size={16} color='red' fill={like ? 'red' : 'white'} /> {totalLike}
    </button>
  );
};

export default CommentLiked;
