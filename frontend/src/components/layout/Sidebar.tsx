import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

type MenuItem = {
  title: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const menu: MenuItem[] = [
  { title: 'Home', href: '/' },
  {
    title: 'Tools',
    children: [
      { label: 'Dashboard', href: '/tools' },
      { label: 'Article Writer', href: '/tools/article-writer' },
      { label: 'Title Generator', href: '/tools/title-generator' },
      { label: 'Image Generator', href: '/tools/image-generator' },
      { label: 'Image Editor', href: '/tools/image-editor' },
      { label: 'Resume Reviewer', href: '/tools/resume-reviewer' },
      { label: 'File Manager', href: '/tools/file-manager' },
      { label: 'Gallery', href: '/tools/gallery' },
    ],
  },
  {
    title: 'Shopping',
    children: [
      { label: 'Product', href: '/products' },
      { label: 'Cart', href: '/carts' },
      { label: 'Shipping Address', href: '/shipping-address' },
      { label: 'Orders', href: '/orders' },
      { label: 'Favorite', href: '/favorites' },
    ],
  },
  { title: 'Messenger', href: '/messenger' },
  {
    title: 'Admin Panel',
    children: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Products', href: '/admin/products' },
      { label: 'Brands', href: '/admin/brands' },
      { label: 'Categories', href: '/admin/categories' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Orders', href: '/admin/orders' },
    ],
  },
  { title: 'profile', href: '/profile' },
];

export default function Sidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);

  const toggle = (title: string) => {
    setActive((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className='fixed inset-0 bg-black/50 z-40 md:hidden' onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 md:sticky top-0 left-0 !h-full w-64 bg-white shadow transform transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <h2 className='py-4 px-6 font-bold border-b h-[60px]'>Cartify Shop</h2>

        <nav className='w-full overflow-y-auto h-full'>
          {menu.map((item) => (
            <div key={item.title}>
              {/* Parent */}
              <button
                onClick={() => {
                  if (item.children) {
                    toggle(item.title);
                  } else {
                    navigate(`/${item.href}`);
                  }
                }}
                className='w-full flex justify-between items-center py-4 px-6 rounded hover:bg-gray-100 border-t'>
                <span className='text-sm font-medium text-gray-700'>{item.title}</span>
                {item.children && (
                  <>{active === item.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</>
                )}
              </button>

              {/* Dropdown */}
              {item.children && active === item.title && (
                <div className='mt-1 space-y-1 transition-all duration-300'>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.href}
                      className='block pl-10 py-2 text-sm rounded hover:bg-gray-100'>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
