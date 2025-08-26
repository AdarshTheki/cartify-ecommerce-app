import { ChevronDown, Star } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="overflow-hidden">
      <div id="home" className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Hero Content  */}
          <div
            className="w-full lg:w-1/2 order-2 lg:order-1 animate-fadeIn"
            style={{ animationDuration: '800ms' }}>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Discover Modern Essentials
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Elevate your lifestyle with our curated collection of premium
              products. Designed for the modern consumer.
            </p>
            <div className="flex max-sm:flex-col text-center gap-4">
              <NavLink
                to="/products"
                className="bg-indigo-600 flex-1 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105">
                Shop Now
              </NavLink>
              <a
                href="#categories"
                className="bg-white/50 border flex-1 border-gray-300 hover:border-indigo-600 text-gray-800 hover:text-indigo-600 px-8 py-3 rounded-md font-medium transition-all duration-300">
                Explore Categories
              </a>
            </div>

            {/* Featured Tags  */}
            <div className="mt-10 flex flex-wrap gap-3">
              <span className="bg-white/50 text-gray-800 px-4 py-1 rounded-full text-sm">
                Free Shipping
              </span>
              <span className="bg-white/50 text-gray-800 px-4 py-1 rounded-full text-sm">
                Premium Quality
              </span>
              <span className="bg-white/50 text-gray-800 px-4 py-1 rounded-full text-sm">
                30-Day Returns
              </span>
            </div>
          </div>

          {/* Hero Images  */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 relative">
            <div
              className="relative h-[400px] md:h-[500px] animate-fadeIn-zoom"
              style={{ animationDuration: '800ms' }}>
              {/* Main Hero Image  */}
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2MzQ2fDB8MXxzZWFyY2h8MXx8bW9kZXJuJTJCZWNvbW1lcmNlJTJCaGVybyUyQnNlY3Rpb24lMkJ3aXRoJTJCcHJvZHVjdCUyQnNob3djYXNlfGVufDB8fHx8MTc0NTg0MzgzN3ww&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
                alt="Android Smartwatch"
                className="w-3/4 h-auto object-cover rounded-lg shadow-xl mx-auto z-10 relative"
              />

              {/* Background decorative elements  */}
              <div
                className="absolute top-[5%] right-[5%] w-40 h-40 bg-indigo-200 rounded-full opacity-60 animate-pulse"
                style={{ animationDuration: '3000ms' }}></div>
              <div
                className="absolute bottom-[10%] left-[5%] w-32 h-32 bg-pink-200 rounded-full opacity-60 animate-pulse"
                style={{ animationDuration: '4000ms' }}></div>

              {/* Product Highlight Card  */}
              <div
                className="absolute -bottom-4 -right-4 md:bottom-10 md:right-0 bg-white/50 p-4 rounded-lg shadow-lg w-48 transition-all duration-500 animate-slide-in-bottom"
                style={{
                  animationDuration: '3000ms',
                  animationDelay: '400ms',
                }}>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2MzQ2fDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTJCZWNvbW1lcmNlJTJCaGVybyUyQnNlY3Rpb24lMkJ3aXRoJTJCcHJvZHVjdCUyQnNob3djYXNlfGVufDB8fHx8MTc0NTg0MzgzN3ww&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
                    alt="Featured Product"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      New Arrival
                    </p>
                    <p className="text-xs text-gray-500">Shop Now</p>
                  </div>
                </div>
              </div>

              {/* Rating Card  */}
              <div
                className="absolute -top-4 -left-4 md:top-10 md:left-0 bg-white p-3 rounded-lg shadow-lg transition-all duration-500 animate-slide-in-top"
                style={{
                  animationDuration: '5000ms',
                  animationDelay: '500ms',
                }}>
                <div className="flex items-center">
                  <div className="flex gap-1 text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          fill="oklch(85.2% 0.199 91.936)"
                        />
                      ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">4.9 (2.5k)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator  */}
        <div className="flex justify-center mt-2 animate-bounce">
          <a
            href="#categories"
            className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
