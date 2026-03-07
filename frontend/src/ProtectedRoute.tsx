import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from './redux/store';
import { Loading } from './ui';

interface ProtectedRouteProp {
  role: string;
}

const ProtectedRoute = ({ role }: ProtectedRouteProp) => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  if (!role || !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  } else if (role === 'admin' && isAuthenticated) {
    <Navigate to='/admin' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
