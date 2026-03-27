/* eslint-disable react-hooks/purity */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ProductItem } from '../../components';
import { useAppSelector } from '../../store/store';

const Trending = ({
  heading = 'Trending Products',
  size = 8,
}: {
  heading: string;
  size: number;
}) => {
  const { items } = useAppSelector((s) => s.product);

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
    <section className='w-full'>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center max-w-2xl mx-auto'>
        <div className='flex justify-center mb-3'>
          <span className='flex items-center gap-2 text-sm bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full'>
            <Sparkles className='w-4 h-4' /> Fresh Picks
          </span>
        </div>

        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>{heading}</h2>

        <p className='text-gray-500'>
          Discover new arrivals today! Trendy, stylish, and fresh picks curated just for you.
        </p>
      </motion.div>

      {/* Products Grid */}
      {/* <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-sm:flex max-sm:overflow-x-auto max-sm:scrollbar-hidden'> */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-5 gap-2 mt-10'>
        {shuffledItems?.length
          ? shuffledItems.map((item, index) => (
              <ProductItem key={item._id} latest={true} delay={index / 10} {...item} />
            ))
          : Array.from({ length: size }, (_, i) => (
              <div
                key={i}
                className='max-sm:min-w-64 h-[260px] bg-gray-200 animate-pulse rounded-2xl'
              />
            ))}
      </div>

      {/* Mobile Indicator */}
      <div className='flex justify-center mt-4 md:hidden'>
        <div className='flex space-x-2'>
          <div className='w-8 h-2 bg-indigo-600 rounded-full'></div>
          <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
          <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
        </div>
      </div>
    </section>
  );
};

export default Trending;
