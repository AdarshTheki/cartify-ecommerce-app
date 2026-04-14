import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Home,
  Sparkles,
  LayoutDashboard,
  SquarePen,
  Image,
  Eraser,
  FileText,
  Folder,
  Images,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  Package,
  Heart,
  MessageCircle,
  Shield,
  Boxes,
  Tag,
  Users,
  ClipboardList,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  open: boolean;
  onClose: () => void;
};

const menu = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'AI Tools',
    icon: Sparkles,
    children: [
      { label: 'Dashboard', href: '/tools', icon: LayoutDashboard },
      { label: 'Text Generator', href: '/tools/text-generator', icon: SquarePen },
      { label: 'Image Generator', href: '/tools/image-generator', icon: Image },
      { label: 'Image Editor', href: '/tools/image-editor', icon: Eraser },
      { label: 'Resume Reviewer', href: '/tools/resume-reviewer', icon: FileText },
      { label: 'File Manager', href: '/tools/file-manager', icon: Folder },
      { label: 'Image Gallery', href: '/tools/image-gallery', icon: Images },
    ],
  },
  {
    title: 'Shop',
    icon: ShoppingBag,
    children: [
      { label: 'Products', href: '/products', icon: Boxes },
      { label: 'Cart', href: '/carts', icon: ShoppingCart },
      { label: 'Shipping Address', href: '/shipping-address', icon: MapPin },
      { label: 'Orders', href: '/orders', icon: Package },
      { label: 'Favorites', href: '/favorites', icon: Heart },
    ],
  },
  {
    title: 'Messenger',
    href: '/messenger',
    icon: MessageCircle,
  },
  {
    title: 'Admin Panel',
    icon: Shield,
    children: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Products', href: '/admin/products', icon: Boxes },
      { label: 'Brands', href: '/admin/brands', icon: Tag },
      { label: 'Categories', href: '/admin/categories', icon: ClipboardList },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Orders', href: '/admin/orders', icon: Package },
    ],
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export default function Sidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<string | null>(null);

  const toggle = (title: string) => {
    setActive((prev) => (prev === title ? null : title));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden'
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white/90 backdrop-blur-lg border-r shadow-sm transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Header */}
        <div className='h-[64px] flex items-center px-6 border-b'>
          <div className='flex items-center gap-2 font-bold text-gray-800'>
            <LayoutDashboard className='w-5 h-5 text-indigo-600' />
            Cartify
          </div>
        </div>

        {/* Menu */}
        <nav className='h-[calc(100%-64px)] overflow-y-auto px-2 py-3 space-y-1'>
          {menu.map((item) => {
            const openDropdown = active === item.title;

            return (
              <div key={item.title}>
                {/* Parent */}
                <button
                  onClick={() => {
                    if (item.children) toggle(item.title);
                    else navigate(`/${item.href}`);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition
                  ${isActive(item.href || '') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <div className='flex items-center gap-2'>
                    {item.icon && <item.icon className='w-4 h-4' />}
                    {item.title}
                  </div>

                  {item.children &&
                    (openDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>

                {/* Children */}
                <AnimatePresence initial={false}>
                  {item.children && openDropdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='overflow-hidden'>
                      <div className='ml-6 mt-1 space-y-1 border-l pl-3'>
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.href}
                            className={({ isActive }) =>
                              `flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition ${
                                isActive
                                  ? 'bg-indigo-100 text-indigo-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`
                            }>
                            {child.icon && <child.icon className='w-3 h-3' />}
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
