import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp } from 'lucide-react';
import { errorHandler, axios } from '../../config';

const CommentLiked = ({ reviewId, likes }) => {
  const userId = useSelector((state) => state?.auth?.user?._id);
  const [like, setLike] = useState(userId ? likes?.includes(userId) : false);
  const [totalLike, setTotalLike] = useState(likes?.length);

  const handleLike = async () => {
    try {
      const res = await axios.patch(`/comment/${reviewId}/like`);
      setTotalLike(res.data.data.likes);
      setLike(!like);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`svg-btn text-xs flex gap-1 !w-16 ${like && 'bg-indigo-200'}`}>
      <ThumbsUp size={16} /> {totalLike}
    </button>
  );
};

export default CommentLiked;
