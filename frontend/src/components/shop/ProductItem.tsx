import { NavLink } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { LazyImage } from '../index';
import { errorHandler } from '../../services';
import { addToCart } from '../../services/cartService';
import ProductFavorite from './ProductFavorite';
import { useAppSelector } from '../../store/store';
import type { Product } from '../../types';

interface ProductItemProp extends Product {
  latest?: boolean;
  delay?: number;
}

const ProductItem = ({ delay = 0, latest = false, ...item }: ProductItemProp) => {
  const { user } = useAppSelector((s) => s.auth);

  const handleAddToCart = async (id: string, qty: number) => {
    try {
      await addToCart(id, qty);
      toast.success('Added to cart');
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className='group relative w-full rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden'>
      {/* Image Section */}
      <div className='relative overflow-hidden'>
        <NavLink to={`/products/${item._id}`}>
          <LazyImage
            src={item.thumbnail}
            className='w-full h-[220px] object-cover group-hover:scale-110 transition duration-500'
            alt={item.title}
          />
        </NavLink>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition' />

        {/* Wishlist */}
        {!!user?._id && (
          <ProductFavorite
            id={item._id}
            className='absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow'
            name=''
          />
        )}

        {/* Quick Add */}
        {!!user?._id && (
          <button
            onClick={() => handleAddToCart(item._id, 1)}
            className='absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition'>
            <ShoppingBag className='w-5 h-5' />
          </button>
        )}

        {/* Badge */}
        {latest && (
          <span className='absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md'>
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className='p-4 space-y-2'>
        {/* Brand + Rating */}
        <div className='flex items-center'>
          <span className='px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-600 capitalize'>
            {item.brand}
          </span>

          <div className='ml-auto flex items-center text-amber-500'>
            <Star className='w-4 h-4' fill='currentColor' />
            <span className='ml-1 text-sm font-semibold'>{item?.rating?.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className='text-sm md:text-base font-semibold text-gray-800 line-clamp-2 min-h-[40px]'>
          {item.title}
        </h3>

        {/* Price + Category */}
        <div className='flex items-center justify-between pt-1'>
          <span className='text-lg font-bold text-indigo-600'>₹{item.price}</span>

          <span className='text-xs text-gray-500 uppercase tracking-wide'>
            {item.category.split('-').join(' ')}
          </span>
        </div>
      </div>

      {/* Hover Bottom Bar */}
      <div className='absolute bottom-0 left-0 w-full h-1 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left' />
    </motion.div>
  );
};

export default ProductItem;
