import React from 'react';
import HeartFavorite from './HeartFavorite';
import { NavLink } from 'react-router-dom';
import { LazyImage } from '../utils';
import { ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { axios, errorHandler } from '../config';
import { toast } from 'react-toastify';

export default function Item({ delay = '100ms', ...item }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const types = [
    { name: 'bestseller', bg: 'bg-green-100', text: 'text-green-800' },
    { name: 'new', bg: 'bg-pink-100', text: 'text-pink-800' },
    { name: 'popular', bg: 'bg-blue-100', text: 'text-blue-800' },
    { name: 'limited', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    { name: 'sale', bg: 'bg-red-100', text: 'text-red-800' },
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];

  const handleAddToCart = async () => {
    try {
      if (!user?._id) return toast.error('Un-Authorized User');
      if (!item?._id) return toast.error('Product ID not found');

      const res = await axios.post(`/cart`, {
        productId: item._id,
        quantity: 1,
      });
      if (res.data) {
        dispatch(addItem(res.data.data.items));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div
      className="w-full rounded-xl my-2 bg-white/40 shadow-sm hover:-translate-y-1 transition duration-300 group animate-fadeIn"
      style={{ animationDelay: delay }}>
      <div className="relative overflow-hidden rounded-t-lg">
        <NavLink to={`/products/${item._id}`}>
          <LazyImage
            src={item.thumbnail}
            fallback={'/placeholder.jpg'}
            className="w-full h-[200px] object-cover transform group-hover:scale-105 transition duration-500"
          />
        </NavLink>
        <HeartFavorite
          id={item._id}
          className="absolute top-2 right-2 p-1.5 bg-white/80"
        />

        <button
          onClick={handleAddToCart}
          className="text-indigo-600 absolute top-12 right-2 sm:hidden p-1.5 bg-transparent">
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${randomType.bg} ${randomType.text} capitalize`}>
            {randomType.name}
          </span>
          <div className="ml-auto flex items-center text-amber-400">
            <Star className="w-4" />
            <span className="ml-1 text-sm text-gray-600">{item?.rating}</span>
          </div>
        </div>
        <p className="sm:text-lg text-base text-gray-600 leading-[1.4] font-medium sm:line-clamp-1 max-sm:min-h-[50px] line-clamp-2">
          {item.title}
        </p>
        <p className="text-gray-600 text-sm mb-3 max-sm:hidden flex gap-2 justify-between capitalize">
          <span>{item.category && '#' + item.category}</span>
          <span>{item.brand && '#' + item.brand}</span>
        </p>
        <div className="flex items-center mt-2 justify-between">
          <span className="text-lg font-bold">${item.price}</span>
          <button
            onClick={handleAddToCart}
            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 sm:flex hidden items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
