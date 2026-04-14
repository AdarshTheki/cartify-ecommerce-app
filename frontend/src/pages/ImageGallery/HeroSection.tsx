const HeroSection = () => {
  return (
    <section className='w-full bg-gradient-to-br from-gray-50 via-white to-indigo-50 overflow-hidden'>
      <div className='grid lg:grid-cols-2 gap-12 items-center'>
        {/* Left Content */}
        <div className='space-y-6'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight'>
            Explore Stunning <span className='text-indigo-600'>Image Collections</span>
          </h1>

          <p className='text-lg text-gray-600 max-w-xl'>
            Search, filter, and discover high-quality images. Customize with transformations like
            crop, blur, rotate, and download instantly.
          </p>
        </div>

        {/* Right Images Preview */}
        <div className='relative grid grid-cols-2 gap-4'>
          <img
            src='https://images.unsplash.com/photo-1506744038136-46273834b3fb'
            className='rounded-xl shadow-lg object-cover h-30 w-full'
          />

          <img
            src='https://images.unsplash.com/photo-1492724441997-5dc865305da7'
            className='rounded-xl shadow-lg object-cover h-42 w-full'
          />

          <img
            src='https://images.unsplash.com/photo-1518770660439-4636190af475'
            className='rounded-xl shadow-lg object-cover h-42 w-full'
          />

          <img
            src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
            className='rounded-xl shadow-lg object-cover h-30 w-full'
          />

          {/* Floating Badge */}
          <div className='absolute -bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-sm'>
            10K+ Images Available
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
