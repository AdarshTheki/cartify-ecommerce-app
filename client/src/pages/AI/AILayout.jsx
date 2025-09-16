import React from 'react';
import { AiToolsData } from '../../assets';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { classNames } from '../../config';

const AILayout = () => {
  const { pathname } = useLocation();

  const navClass = (active, path) =>
    classNames(
      active === path &&
        'bg-gradient-to-r from-blue-600 font-medium to-purple-600 text-white',
      'p-2 rounded-full text-base items-center px-4 flex gap-2 border border-gray-300 text-nowrap'
    );

  return (
    <div className="sm:flex w-full min-h-[80dvh]">
      {/* mobile menu */}
      <div className="sm:hidden p-2 py-4 overflow-hidden flex gap-1 overflow-x-auto scrollbar-hidden">
        <NavLink to={'/ai'} className={navClass(pathname, '/ai')}>
          <Home className="w-3 h-3" />
          Dashboard
        </NavLink>
        {AiToolsData.map((tool, index) => (
          <NavLink
            key={index}
            to={tool.path}
            className={navClass(pathname, tool.path)}>
            <tool.Icon className="w-3 h-3" />
            {tool.title}
          </NavLink>
        ))}
      </div>

      {/* desktop menu */}
      <div className="flex flex-col min-w-[280px] bg-white p-2 sticky gap-4 text-base top-14 min-h-[80dvh] h-full max-sm:hidden">
        <NavLink to={'/ai'} className={navClass(pathname, '/ai')}>
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>
        {AiToolsData.map((tool, index) => (
          <NavLink
            key={index}
            to={tool.path}
            className={navClass(pathname, tool.path)}>
            <tool.Icon size={18} />
            <span>{tool.title}</span>
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default AILayout;
