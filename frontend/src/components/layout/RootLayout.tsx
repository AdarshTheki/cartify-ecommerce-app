import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../ui/Footer';
import { ecommerceMenu } from '../../utils';
import { BellDot, User, Search } from 'lucide-react';
import { useAppSelector } from '../../store/store';
import { Avatar, AvatarImage } from '../ui/Avatar';
import { motion } from 'framer-motion';

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className='min-h-screen flex bg-gray-50'>
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main */}
      <div className='flex-1 flex flex-col'>
        {/* Topbar */}
        <header className='bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 h-[64px]'>
          {/* Left */}
          <div className='flex items-center gap-3'>
            <button className='md:hidden text-xl' onClick={() => setOpen(true)}>
              ☰
            </button>

            <h1 className='text-lg font-semibold text-gray-800 hidden sm:block'>Dashboard</h1>
          </div>

          {/* Center Search */}
          <div className='hidden md:flex items-center bg-gray-100 rounded-xl px-3 py-2 w-full max-w-md'>
            <Search className='w-4 h-4 text-gray-400' />
            <input
              placeholder='Search anything...'
              className='bg-transparent outline-none px-2 text-sm w-full'
            />
          </div>

          {/* Right */}
          <div className='flex items-center gap-3'>
            <button className='relative p-2 rounded-lg hover:bg-gray-100 transition'>
              <BellDot size={18} />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
            </button>

            {!user?._id ? (
              <button
                onClick={() => navigate('/login')}
                className='flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition'>
                <User size={16} />
                <span className='text-sm'>Sign In</span>
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/setting')}
                className='flex items-center gap-2 bg-gray-100 px-2 py-1.5 rounded-lg'>
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                </Avatar>
                <span className='text-sm font-medium hidden sm:block'>
                  {user?.fullName || 'Profile'}
                </span>
              </motion.button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-y-auto p-4'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <Footer menus={ecommerceMenu} />
      </div>
    </div>
  );
}
