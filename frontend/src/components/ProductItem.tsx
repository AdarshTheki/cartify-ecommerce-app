import { NavLink } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { addItem } from '../redux/cartSlice';
import ProductFavorite from './ProductFavorite';
import { useApi } from '../hooks';
import { LazyImage } from './ui';

type ProductItemProp = {
  delay?: string;
} & ProductType;

const ProductItem = ({ delay = '100ms', ...item }: ProductItemProp) => {
  const { callApi, data } = useApi();

  return (
    <div
      className='w-full rounded-xl my-2 bg-white/40 shadow-md group animate-fadeIn'
      style={{ animationDelay: delay }}>
      <div className='relative overflow-hidden rounded-t-lg'>
        <NavLink to={`/products/${item._id}`}>
          <LazyImage
            src={item.thumbnail}
            className='w-full h-[200px] object-cover transform group-hover:scale-105 transition duration-500'
            alt=''
          />
        </NavLink>
        <ProductFavorite
          id={item._id}
          className='absolute top-2 right-2 p-1.5 bg-white/80'
          name=''
        />

        <button
          onClick={() => {
            callApi('/cart', 'POST', { productId: item._id, quantity: 1 });
            addItem(data);
          }}
          className='text-indigo-600 absolute top-12 right-2 p-1.5 bg-transparent'>
          <ShoppingBag className='w-5 h-5' />
        </button>
      </div>
      <div className='p-4'>
        <div className='mb-2 flex items-center'>
          <span
            className={`px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-600 capitalize`}>
            {item.brand}
          </span>
          <div className='ml-auto flex items-center text-amber-600'>
            <Star className='w-4' />
            <span className='ml-1 text-sm font-semibold'>{item?.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className='sm:text-lg text-base text-gray-700 leading-[1.4] font-medium sm:line-clamp-1 max-sm:min-h-[50px] line-clamp-2'>
          {item.title}
        </p>

        <div className='flex items-center mt-2 justify-between'>
          <span className='text-lg font-bold'>${item.price}</span>
          <span className='uppercase text-xs'>{item.category.split('-').join(' ')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
