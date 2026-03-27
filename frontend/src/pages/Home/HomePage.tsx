import HeroSection from './HeroSection';
import Trending from './Trending';
import Category from './Category';
import Testimonial from './Testimonial';
import ToolsSection from './ToolsSection';
import Certificate from './Certificate';

const HomePage = () => {
  return (
    <main className='w-full space-y-20 '>
      <HeroSection />

      <Category />

      <ToolsSection />

      <Trending heading='New Arrivals' size={4} />

      <Testimonial />

      <Certificate />
    </main>
  );
};

export default HomePage;
