import { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductItem } from '../components';
import { Loading, NotFound } from '../ui';
import Certificate from './Home/Certificate';
import Trending from './Home/Trending';
import { useApi } from '../hooks';

const UserFavoritePage = () => {
  const { callApi, loading, data } = useApi<ProductType[]>();

  useEffect(() => {
    callApi('/user/favorite', 'GET');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className='relative mx-auto px-2 container'>
        {data && data?.length > 0 ? (
          <div className='grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2 w-full'>
            {data?.map((item) => (
              <ProductItem key={item._id} {...item} />
            ))}
          </div>
        ) : (
          <NotFound
            canvas={<ShoppingCart className='w-20 h-20 text-gray-400 mb-4 mx-auto' />}
            title='Your favorite is empty.'
            description='Looks like you haven’t added anything to Your favorite is empty.'
            linkName='Go to Products'
            linkClass='bg-indigo-600'
            linkTo='/products'
            mainClass='min-h-[100px]'
          />
        )}
      </div>

      <Certificate />

      <Trending heading='For Your Wishlist' size={4} />
    </div>
  );
};

export default UserFavoritePage;
