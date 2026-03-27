import { ArrowRightIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components';
import { useAppSelector } from '../../store/store';

const Category = ({ size = 8 }: { size?: number }) => {
  const { items } = useAppSelector((state) => state.category);

  return (
    <section id='categories' className='w-full '>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center max-w-2xl mx-auto mb-10'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>Explore Categories</h2>

        <p className='text-gray-500'>
          Hot new drops in Fashion, Accessories, Tech & Lifestyle. Discover what's trending now.
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className='grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-6 grid-cols-2 gap-3'>
        {items?.length
          ? items.slice(0, size).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className='group relative max-sm:w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300'>
                {/* Image */}
                <img
                  src={
                    item.thumbnail || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'
                  }
                  alt={item.title}
                  className='w-full aspect-[6/5] object-cover group-hover:scale-110 transition duration-500'
                />

                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end'>
                  <div className='p-5'>
                    <h3 className='text-lg font-semibold text-white capitalize'>{item.title}</h3>

                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs text-gray-200'>{34 - index * 3} Products</span>

                      <NavLink
                        to={`/products?category=${item.title}`}
                        className='bg-white/90 hover:bg-indigo-600 hover:text-white p-2 rounded-full transition'>
                        <ArrowRightIcon className='w-4 h-4' />
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className='absolute inset-0 border-2 border-transparent group-hover:border-indigo-500 rounded-2xl transition' />
              </motion.div>
            ))
          : Array.from({ length: size }, (_, i) => (
              <div key={i} className='max-sm:min-w-64'>
                <Skeleton className='h-[220px] rounded-2xl' />
              </div>
            ))}
      </div>

      {/* Mobile Indicator */}
      <div className='flex justify-center mt-6 md:hidden'>
        <div className='flex space-x-2'>
          <div className='w-8 h-2 bg-indigo-600 rounded-full'></div>
          <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
          <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
        </div>
      </div>
    </section>
  );
};

export default Category;
