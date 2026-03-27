import { Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section id='home' className='w-full'>
      <div className='grid lg:grid-cols-2 gap-12 items-center'>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='space-y-6'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight'>
            Discover <span className='text-indigo-600'>Modern Essentials</span>
          </h1>

          <p className='text-lg text-gray-600 max-w-xl'>
            Elevate your lifestyle with our curated collection of premium products designed for the
            modern consumer.
          </p>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <NavLink
              to='/products'
              className='bg-indigo-600 w-fit hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
              Shop Now
            </NavLink>

            <a
              href='#categories'
              className='border border-gray-300 w-fit hover:border-indigo-600 text-gray-800 hover:text-indigo-600 px-8 py-3 rounded-xl font-medium backdrop-blur-md bg-white/60 transition-all duration-300'>
              Explore Categories
            </a>
          </div>

          {/* Tags */}
          <div className='flex flex-wrap gap-3 pt-4'>
            {['Free Shipping', 'Premium Quality', '30-Day Returns'].map((tag) => (
              <span
                key={tag}
                className='bg-white/70 backdrop-blur px-4 py-1 rounded-full text-sm shadow-sm'>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='relative flex justify-center'>
          {/* Main Image */}
          <img
            src='https://images.unsplash.com/photo-1523275335684-37898b6baf30'
            alt='Smartwatch'
            className='w-3/4 rounded-2xl shadow-2xl z-10'
          />

          {/* Floating Shapes */}
          <div className='absolute top-0 right-10 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-50 animate-pulse' />
          <div className='absolute bottom-0 left-10 w-28 h-28 bg-pink-200 rounded-full blur-2xl opacity-50 animate-pulse' />

          {/* Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='absolute bottom-6 right-0 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-xl w-52'>
            <div className='flex items-center gap-3'>
              <img
                src='https://images.unsplash.com/photo-1556228578-8c89e6adf883'
                alt='product'
                className='w-12 h-12 rounded-md object-cover'
              />
              <div>
                <p className='text-sm font-semibold'>New Arrival</p>
                <p className='text-xs text-gray-500'>Shop Now</p>
              </div>
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='absolute top-6 left-0 bg-white p-3 rounded-xl shadow-lg flex items-center'>
            <div className='flex text-yellow-400'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className='w-4 h-4' fill='currentColor' />
                ))}
            </div>
            <span className='ml-2 text-sm font-medium'>4.9 (2.5k)</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
