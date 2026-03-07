import { Heart } from 'lucide-react';
import { useAppSelector } from '../redux/store';
import { useApi } from '../hooks';

type HeartFavoriteProp = {
  id: string;
  className: string;
  name: string;
};

const HeartFavorite = ({ id, className, name }: HeartFavoriteProp) => {
  const { user } = useAppSelector((state) => state.auth);
  const { callApi, loading, data } = useApi<string[]>();

  return (
    <button
      onClick={() => callApi(`/user/favorite/${id}`, 'PATCH')}
      className={`bg-transparent! ${className}`}
      title='favorite'>
      {!!name && name}
      {loading ? (
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5'></div>
        </div>
      ) : (
        <Heart
          fill={`${!!user?.favorite.includes(id) || data?.includes(id) ? 'red' : '#ff01'}`}
          stroke='red'
          className='h-5 w-5'
        />
      )}
    </button>
  );
};

export default HeartFavorite;
