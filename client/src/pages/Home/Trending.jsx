import React from 'react';
import { useSelector } from 'react-redux';
import { ProductItem } from '../../components';
import { Skeleton } from '../../utils';

const Trending = ({ heading = 'Trending Products', size = 8 }) => {
  const { items } = useSelector((s) => s.product);

  // Shuffle items array and pick a random subset (e.g., 8 items)
  const shuffledItems = React.useMemo(() => {
    if (!items) return [];
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, size);
  }, [items, size]);

  return (
    <div className="container mx-auto">
      <div className="text-center">
        <h2 className="text-slate-700 text-3xl mb-4 font-semibold">
          {heading}
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Discover new arrivals today! Trendy, stylish, and fresh picks waiting
          just for you.
        </p>
      </div>

      <div className="sm:grid flex md:grid-cols-4 sm:grid-cols-3 gap-5 grid-cols-2 overflow-x-auto scrollbar-hidden mt-8">
        {shuffledItems?.length
          ? shuffledItems.map((item, i) => (
              <div className="max-sm:min-w-64 w-full" key={item._id}>
                <ProductItem {...item} delay={i + 1 + '00ms'} />
              </div>
            ))
          : Array.from({ length: size }, (v, i) => (
              <Skeleton height={210} key={i} className={'max-sm:min-w-64 '} />
            ))}
      </div>

      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex space-x-2">
          <div className="w-8 h-2 bg-indigo-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
