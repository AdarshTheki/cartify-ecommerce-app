import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../ui/Footer';
import {
  BellDot,
  User,
  Search,
  Menu,
  Home,
  Package,
  GalleryHorizontal,
  MessagesSquare,
  Heart,
  FolderKanban,
  Bot,
  Settings,
} from 'lucide-react';
import { useAppSelector } from '../../store/store';
import { Avatar, AvatarImage } from '../ui/Avatar';
import { motion } from 'framer-motion';

const ecommerceMenu = [
  {
    id: 1,
    name: 'Home',
    path: '/',
    Icon: Home,
  },
  {
    id: 2,
    name: 'Products',
    path: '/products',
    Icon: Package,
  },
  {
    id: 3,
    name: 'Gallery',
    path: '/gallery',
    Icon: GalleryHorizontal,
  },
  {
    id: 4,
    name: 'Messenger',
    path: '/messenger',
    Icon: MessagesSquare,
  },
  {
    id: 5,
    name: 'Favorite',
    path: '/favorite',
    Icon: Heart,
  },
  {
    id: 6,
    name: 'File Manager',
    path: '/file-manager',
    Icon: FolderKanban,
  },
  {
    id: 7,
    name: 'AI Tools',
    path: '/ai',
    Icon: Bot,
  },
  {
    id: 8,
    name: 'Profile',
    path: '/profile',
    Icon: Settings,
  },
];

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main */}
      <div className='flex-1 flex flex-col'>
        {/* Topbar */}
        <header className='sticky top-0 z-40 h-[64px] border-b bg-white/70 backdrop-blur-lg'>
          <div className='h-full px-4 flex items-center justify-between gap-4'>
            {/* Left */}
            <div className='flex items-center gap-3'>
              <button
                className='md:hidden p-2 rounded-lg hover:bg-gray-100'
                onClick={() => setOpen(true)}>
                <Menu className='w-5 h-5' />
              </button>
            </div>

            {/* Center Search */}
            <div className='hidden md:flex items-center bg-gray-100/80 hover:bg-white border border-transparent hover:border-gray-200 transition rounded-xl px-3 py-2 w-full max-w-lg'>
              <Search className='w-4 h-4 text-gray-400' />
              <input
                placeholder='Search products, orders, users...'
                className='bg-transparent outline-none px-2 text-sm w-full'
              />
            </div>

            {/* Right */}
            <div className='flex items-center gap-2 sm:gap-3'>
              {/* Notification */}
              <button className='relative p-2 rounded-xl hover:bg-gray-100 transition'>
                <BellDot size={18} />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
              </button>

              {/* Auth */}
              {!user?._id ? (
                <button
                  onClick={() => navigate('/login')}
                  className='flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition'>
                  <User size={16} />
                  <span className='text-sm'>Sign In</span>
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/profile')}
                  className='flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl transition shadow'>
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                  </Avatar>
                  <span className='text-sm font-medium hidden sm:block'>
                    {user?.fullName || 'Profile'}
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4'>
          <Outlet />
        </main>

        {/* Footer */}
        <Footer menus={ecommerceMenu} />
      </div>
    </div>
  );
}
