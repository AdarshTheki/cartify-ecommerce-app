import { useEffect } from 'react';
import { DataState, ProductItem } from '../components';
import Certificate from './Home/Certificate';
import Trending from './Home/Trending';
import { useApi } from '../hooks';
import type { Product } from '../types';

const UserFavoritePage = () => {
  const { callApi, loading, data, error } = useApi<Product[]>();

  useEffect(() => {
    callApi('/user/favorite');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className='relative mx-auto px-2 container'>
        <DataState data={data} error={error} loading={loading}>
          {(products) => (
            <div className='grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2 w-full'>
              {products?.map((item) => (
                <ProductItem key={item._id} {...item} />
              ))}
            </div>
          )}
        </DataState>
      </div>

      <Certificate />

      <Trending heading='For Your Wishlist' size={4} />
    </div>
  );
};

export default UserFavoritePage;
