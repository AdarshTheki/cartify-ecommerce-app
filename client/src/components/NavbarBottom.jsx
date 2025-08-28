import { Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar } from '../utils';
import { menuItems } from '../assets';

const NavbarBottom = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  return (
    <footer className="sm:hidden sticky bottom-0 px-4 w-full z-50 bg-white/30 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs h-[10vh]">
        {menuItems
          .filter((i) =>
            ['Home', 'Message', 'Wishlist', 'AI Generate'].includes(i.name)
          )
          .map((nav) => (
            <NavLink
              key={nav.id}
              to={nav.path}
              className="flex items-center justify-center flex-col">
              <nav.Icon size={18} />
              {nav.name}
            </NavLink>
          ))}

        <NavLink
          to={'#'}
          onClick={() => navigate('/setting')}
          className="flex items-center justify-center flex-col">
          {user?._id ? (
            <Avatar
              avatarUrl={user?.avatar}
              name={user?.fullName}
              className="!w-5 !h-5"
            />
          ) : (
            <Settings className="w-5 h-5" />
          )}
          Setting
        </NavLink>
      </div>
    </footer>
  );
};

export default NavbarBottom;
