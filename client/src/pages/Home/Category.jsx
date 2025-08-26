import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Skeleton } from '../../utils';

const Category = ({ size = 8 }) => {
  const { items } = useSelector((state) => state.categories);

  return (
    <div className="mx-auto container" id="categories">
      <div className="text-center mb-8">
        <h2 className="text-slate-700 text-3xl mb-4 font-semibold">
          Categories
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Hot new drops in Fashion, Accessories, Tech & Lifestyle. Don’t miss
          what’s trending now!
        </p>
      </div>

      <div className="sm:grid flex md:grid-cols-4 sm:grid-cols-3 gap-5 grid-cols-2 overflow-x-auto scrollbar-hidden">
        {items &&
          items?.slice(0, size).map((item) => (
            <div
              key={item._id}
              className="group max-sm:min-w-64 relative overflow-hidden rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <img
                src={
                  item.thumbnail ||
                  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2MzQ2fDB8MXxzZWFyY2h8MXx8b25saW5lJTJCc3RvcmUlMkJjYXRlZ29yeSUyQm5hdmlnYXRpb258ZW58MHx8fHwxNzQ1ODE4OTUzfDA&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400'
                }
                alt="Electronics"
                className="w-full object-cover aspect-[6/5]  transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <p className="text-xl font-bold text-white mb-2 capitalize">
                    {item.title || 'Electronics'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">48 Products</span>
                    <NavLink
                      to={`/products?category=${item.title}`}
                      className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 transition-colors duration-300">
                      <ArrowRightIcon />
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!items?.length && (
        <div className="sm:grid flex md:grid-cols-4 sm:grid-cols-3 gap-5 grid-cols-2 overflow-x-auto scrollbar-hidden">
          {Array.from({ length: 8 }, (v, i) => (
            <Skeleton height={210} key={i} className="max-sm:min-w-64" />
          ))}
        </div>
      )}

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

export default Category;
