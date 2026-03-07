import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchCurrentUser } from './redux/authSlice';
import { fetchBrands } from './redux/brandSlice';
import { fetchCategories } from './redux/categorySlice';
import { useAppDispatch } from './redux/store';
import router from './Router';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
