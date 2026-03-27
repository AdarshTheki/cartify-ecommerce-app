import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '../../store/store';
import { useApi } from '../../hooks';

type HeartFavoriteProps = {
  id: string;
  className?: string;
  name?: string;
};

const HeartFavorite = ({ id, className = '', name }: HeartFavoriteProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const { callApi, loading } = useApi();
  const [liked, setLiked] = useState(!!user?.favorite?.includes(id));

  const toggleFavorite = async () => {
    try {
      setLiked((prev) => !prev); // optimistic update
      await callApi(`/user/favorite/${id}`, 'PATCH');
    } catch {
      setLiked((prev) => !prev); // revert if failed
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-1 !bg-transparent ${className}`}
      title='favorite'>
      {name && <span>{name}</span>}

      {loading ? (
        <div className='animate-spin rounded-full border-t-2 border-red-500 h-5 w-5'></div>
      ) : (
        <Heart
          className='h-5 w-5 transition-all'
          fill={liked ? 'red' : 'transparent'}
          stroke='red'
        />
      )}
    </button>
  );
};

export default HeartFavorite;
