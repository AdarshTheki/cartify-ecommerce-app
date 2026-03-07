import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loading } from './ui';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ role }: { role?: string }) => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: loadingAuth } = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || loadingAuth) return <Loading />;

  if (!role || !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  } else if (role === 'admin' && isAuthenticated) {
    <Navigate to='/admin' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
