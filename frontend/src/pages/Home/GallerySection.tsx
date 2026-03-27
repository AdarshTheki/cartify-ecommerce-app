import { Search, ImageIcon, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const GallerySection = () => {
  return (
    <section className='w-full bg-gradient-to-br from-gray-50 via-white to-indigo-50 overflow-hidden'>
      <div className='container mx-auto px-4 py-16'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className='space-y-6'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight'>
              Explore Stunning <span className='text-indigo-600'>Image Collections</span>
            </h1>

            <p className='text-lg text-gray-600 max-w-xl'>
              Search, filter, and discover high-quality images. Customize with transformations like
              crop, blur, rotate, and download instantly.
            </p>

            {/* Search Bar */}
            <div className='flex items-center gap-3 bg-white shadow-md rounded-xl px-4 py-3 max-w-xl'>
              <Search className='text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search images...'
                className='w-full outline-none text-sm'
              />
              <button className='bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700'>
                Search
              </button>
            </div>

            {/* Quick Filters */}
            <div className='flex flex-wrap gap-3 pt-2'>
              {['Nature', 'Technology', 'People', 'Abstract'].map((tag) => (
                <button
                  key={tag}
                  className='px-4 py-1 text-sm rounded-full bg-white shadow hover:bg-indigo-600 hover:text-white transition'>
                  {tag}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4'>
              <button className='flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition'>
                <ImageIcon className='w-5 h-5' /> Browse Gallery
              </button>

              <button className='flex items-center gap-2 border px-6 py-3 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition'>
                <SlidersHorizontal className='w-5 h-5' /> Filters
              </button>
            </div>
          </motion.div>

          {/* Right Images Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className='relative grid grid-cols-2 gap-4'>
            <img
              src='https://images.unsplash.com/photo-1506744038136-46273834b3fb'
              className='rounded-xl shadow-lg object-cover h-40 w-full'
            />

            <img
              src='https://images.unsplash.com/photo-1492724441997-5dc865305da7'
              className='rounded-xl shadow-lg object-cover h-52 w-full'
            />

            <img
              src='https://images.unsplash.com/photo-1518770660439-4636190af475'
              className='rounded-xl shadow-lg object-cover h-52 w-full'
            />

            <img
              src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
              className='rounded-xl shadow-lg object-cover h-40 w-full'
            />

            {/* Floating Badge */}
            <div className='absolute -bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-sm'>
              10K+ Images Available
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
