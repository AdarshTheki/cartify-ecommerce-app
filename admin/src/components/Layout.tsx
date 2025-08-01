import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { menuItems } from '@/lib/utils';
import { Footer } from './ui';

const Layout: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:flex">
      {/* <!-- Desktop Menu --> */}
      <nav className="h-screen sticky top-0 flex-shrink-0 w-64 border-r hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="logo" className="w-10 h-8" />
              <span className="text-xl font-semibold">Cartify</span>
            </div>
          </div>
          <div className="flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className="flex gap-4 items-center px-6 py-4 hover:bg-gray-300 duration-300">
                {<item.icon size={22} />}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
          <div className="px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-200">
            <NavLink
              to={user?.email ? '/profile' : '/login'}
              className="flex items-center space-x-3">
              <Avatar style={{ width: 50, height: 50 }}>
                <AvatarImage src={user?.avatar} alt="avatar" />
                <AvatarFallback>
                  {user?.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium uppercase">
                  {user?.fullName || 'Cartify'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'Cartify@example.com'}
                </p>
                <p className="text-xs text-blue-800">{user?.role || 'Guest'}</p>
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* <!-- Mobile Menu --> */}
      <div className="py-2 hidden max-lg:flex px-4 justify-between bg-white top-0 sticky z-40 shadow">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-10 h-8" />
          <span className="text-xl font-semibold">Cartify</span>
        </div>
        <div className="flex gap-2 items-center">
          <NavLink to={'/profile'}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt="avatar" />
              <AvatarFallback>{user?.fullName.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </NavLink>
          <button onClick={() => setOpen(true)} className="svg-btn">
            <Menu />
          </button>
        </div>
      </div>
      <div
        className={`
          fixed inset-0 h-screen z-50 bg-gray-700/30 shadow-lg overflow-hidden rounded-b-2xl
          transform duration-100 ease-linear lg:hidden
          ${open ? 'left-0 opacity-100' : 'left-[100%] opacity-0'}
        `}>
        <div className="p-4 bg-white w-full h-full">
          <button
            onClick={() => setOpen(false)}
            className="svg-btn absolute top-3 right-5">
            <X size={30} />
          </button>
          <div className="flex items-center space-x-2 p-4">
            <img src="/logo.png" alt="logo" className="w-10 h-8" />
            <span className="text-xl font-semibold">Cartify</span>
          </div>
          {menuItems.map((item) => (
            <NavLink
              onClick={() => setOpen(false)}
              key={item.id}
              to={item.path}
              className="flex items-center gap-4 p-4 hover:bg-gray-300 duration-300 rounded-xl">
              {<item.icon size={22} />}
              <span className="ml-3">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <main className="min-h-screen sm:overflow-y-auto w-full">
        <div className="w-full p-4">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
