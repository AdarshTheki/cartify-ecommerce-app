import { useState } from 'react';
import { ecommerceMenu, images } from '../../utils';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { Heart, Menu, Search, Settings, ShoppingCart, User, X } from 'lucide-react';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Footer } from '../index';

export default function EcommerceLayout() {
  const menuItems = ecommerceMenu.filter((i) => !['Favorite', 'Profile'].includes(i.name));
  const [mobileView, setMobileView] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className='w-full flex flex-col'>
      {/* Desktop Screen Top Navbar */}
      <header className='sticky top-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-md'>
        <div className='container mx-auto px-4'>
          <div className='flex h-[10vh] items-center justify-between'>
            {/* Logo  */}
            <h2
              onClick={() => navigate('/')}
              className='text-xl font-bold text-gray-700 uppercase flex items-center cursor-pointer'>
              <img src={images.logo} className='w-8 h-6' />
              Cartify
            </h2>

            {/* Desktop Navigation  */}
            <nav className='hidden lg:block'>
              <ul className='flex space-x-8'>
                {menuItems.map((link) => (
                  <li
                    key={link.id}
                    onClick={() => navigate(link.path)}
                    className='text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors duration-300'>
                    {link.name}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side Icons  */}
            <div className='flex items-center space-x-5'>
              {/* Search Icon  */}
              <button onClick={() => setSearchOpen(!searchOpen)}>
                {searchOpen ? <X className='w-5 h-5' /> : <Search className='w-5 h-5' />}
              </button>

              {/* Cart Icon with Counter  */}
              <button
                onClick={() => navigate('/cart')}
                aria-label='Shopping Cart'
                className='text-gray-700 hover:text-indigo-600 transition-colors duration-300 relative'>
                <ShoppingCart className='w-5 h-5' />
              </button>

              {/* Wishlist Icon  */}
              <button
                onClick={() => navigate('/favorite')}
                aria-label='Wishlist'
                className='text-gray-700 hover:text-indigo-600 transition-colors duration-300 max-sm:hidden'>
                <Heart className='w-5 h-5' />
              </button>

              {/* User Account Icon  */}
              <button
                onClick={() => navigate('/setting')}
                className='text-gray-700 hover:text-indigo-600 transition-colors duration-300 max-sm:hidden'>
                {user?._id ? (
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt='avatar' className='h-8' />
                    <AvatarFallback>{user?.fullName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className='w-5 h-5' />
                )}
              </button>

              {/* Mobile Menu Button  */}
              <button
                onClick={() => setMobileView(!mobileView)}
                id='mobile-menu-button'
                aria-label='Menu'
                className='lg:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-300'>
                {mobileView ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`lg:hidden border-t border-gray-300 overflow-hidden transition-all duration-500 ease-in-out ${
              mobileView ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <ul className='flex py-5 flex-col gap-4'>
              {menuItems.map((link) => (
                <li
                  key={link.id}
                  onClick={() => {
                    setMobileView(false);
                    navigate(link.path);
                  }}
                  className='cursor-pointer flex items-center justify-center gap-2 py-2 font-medium rounded-2xl text-center duration-300 ease-in text-slate-600 hover:bg-indigo-600 hover:text-white'>
                  <link.Icon size={20} />
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Search Bar */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className='p-2 flex gap-2 items-center justify-center left-0 w-full'>
              <div className='max-w-md w-full relative flex items-center justify-between'>
                <Search size={18} className='absolute top-2 left-2' />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type='text'
                  placeholder='Search'
                  className='outline border-none outline-indigo-100 w-full rounded-lg px-10 py-1'
                />
                <button
                  onClick={() => {
                    navigate(`/products?title=${searchQuery}`);
                    setSearchOpen(false);
                  }}
                  className='btn-primary px-4 absolute h-full top-0 right-0 rounded-lg'>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <main className='min-h-screen w-full'>
        <Outlet />
        <Footer menus={ecommerceMenu} />
      </main>

      {/* Mobile Screen Bottom Navbar */}
      <footer className='sm:hidden sticky bottom-0 px-4 w-full z-50 bg-white/30 backdrop-blur-md'>
        <div className='flex items-center justify-between text-xs h-[10vh]'>
          {ecommerceMenu
            .filter((i) => ['Home', 'Message', 'Wishlist', 'AI Generate'].includes(i.name))
            .map((nav) => (
              <NavLink
                key={nav.id}
                to={nav.path}
                className='flex items-center justify-center flex-col'>
                <nav.Icon size={18} />
                {nav.name}
              </NavLink>
            ))}

          <NavLink
            to={'#'}
            onClick={() => navigate('/setting')}
            className='flex items-center justify-center flex-col'>
            {user?._id ? (
              <Avatar style={{ width: 50, height: 50 }}>
                <AvatarImage src={user?.avatar} alt='avatar' />
                <AvatarFallback>{user?.fullName.substring(0, 1)}</AvatarFallback>
              </Avatar>
            ) : (
              <Settings className='w-5 h-5' />
            )}
            Setting
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
