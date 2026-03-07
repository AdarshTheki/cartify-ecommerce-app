import HeroSection from './HeroSection';
import Trending from './Trending';
import Category from './Category';
import Testimonial from './Testimonial';
import AITools from './AITools';

const HomePage = () => {
  return (
    <main className='py-10 px-4 space-y-20'>
      <HeroSection />

      <AITools />

      <div id='featured'>
        <Trending heading='New Arrivals' size={4} />
      </div>

      <Category />

      <Testimonial />
    </main>
  );
};

export default HomePage;
