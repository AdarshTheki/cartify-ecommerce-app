import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

import { useAppSelector } from './redux/store';
import { adminMenu, ecommerceMenu, images } from './utils';
import { Footer } from './components';

export default function RootLayout() {
  const { user } = useAppSelector((s) => s.auth);

  return user?.role === 'admin' ? <AdminLayout /> : <EcommerceLayout />;
}

const EcommerceLayout = () => {
  const menuItems = ecommerceMenu.filter((i) => !['Wishlist', 'Setting'].includes(i.name));
  const [mobileView, setMobileView] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { user } = useAppSelector((s) => s.auth);
  const { items } = useAppSelector((s) => s.cart);

  const itemsCount = Array.isArray(items) ? items?.reduce((p, c) => c?.quantity + p, 0) : 0;

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
                {!!items?.length && (
                  <span className='absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {itemsCount}
                  </span>
                )}
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
                  <Avatar style={{ width: 30, height: 30 }}>
                    <AvatarImage src={user?.avatar} alt='avatar' />
                    <AvatarFallback>{user?.fullName.substring(0, 2)}</AvatarFallback>
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
                  className='!outline border-none !outline-indigo-100 w-full rounded-lg px-10 py-1'
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
                <AvatarFallback>{user?.fullName.substring(0, 2)}</AvatarFallback>
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
};

const AdminLayout = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  return (
    <div className='lg:flex'>
      {/* <!-- Desktop Menu --> */}
      <nav className='h-screen sticky top-0 flex-shrink-0 w-64 border-r hidden lg:block'>
        <div className='flex flex-col h-full'>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <img src={images.logo} alt='logo' className='w-10 h-8' />
              <span className='text-xl font-semibold'>Cartify</span>
            </div>
          </div>
          <div className='flex-1'>
            {adminMenu.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className='flex gap-4 items-center px-6 py-4 hover:bg-gray-300 duration-300'>
                {<item.Icon size={22} />}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
          <div className='px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-200'>
            <NavLink
              to={user?.email ? '/profile' : '/login'}
              className='flex items-center space-x-3'>
              <Avatar style={{ width: 50, height: 50 }}>
                <AvatarImage src={user?.avatar} alt='avatar' />
                <AvatarFallback>{user?.fullName.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <div>
                <p className='text-sm font-medium uppercase'>{user?.fullName || 'Cartify'}</p>
                <p className='text-xs text-gray-500'>{user?.email || 'Cartify@example.com'}</p>
                <p className='text-xs text-blue-800'>{user?.role || 'Guest'}</p>
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* <!-- Mobile Menu --> */}
      <div className='py-2 hidden max-lg:flex px-4 justify-between bg-white top-0 sticky z-40 shadow'>
        <div className='flex items-center space-x-2'>
          <img src='/logo.png' alt='logo' className='w-10 h-8' />
          <span className='text-xl font-semibold'>Cartify</span>
        </div>
        <div className='flex gap-2 items-center'>
          <NavLink to={'/profile'}>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.avatar} alt='avatar' />
              <AvatarFallback>{user?.fullName.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </NavLink>
          <button onClick={() => setOpen(true)} className='svg-btn'>
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
        <div className='p-4 bg-white w-full h-full'>
          <button onClick={() => setOpen(false)} className='svg-btn absolute top-3 right-5'>
            <X size={30} />
          </button>
          <div className='flex items-center space-x-2 p-4'>
            <img src={images.logo} alt='logo' className='w-10 h-8' />
            <span className='text-xl font-semibold'>Cartify</span>
          </div>
          {adminMenu.map((item) => (
            <NavLink
              onClick={() => setOpen(false)}
              key={item.id}
              to={item.path}
              className='flex items-center gap-4 p-4 hover:bg-gray-300 duration-300 rounded-xl'>
              {<item.Icon size={22} />}
              <span className='ml-3'>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <main className='min-h-screen sm:overflow-y-auto w-full'>
        <div className='w-full p-4'>
          <Outlet />
        </div>
        <Footer menus={adminMenu} />
      </main>
    </div>
  );
};
