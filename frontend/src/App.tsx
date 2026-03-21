import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchCurrentUser } from './store/authSlice';
import { fetchBrands } from './store/brandSlice';
import { fetchCategories } from './store/categorySlice';
import { fetchProducts } from './store/productSlice';
import { useAppDispatch } from './store/store';
import router from './routes/AppRoutes';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  return <RouterProvider router={router()} />;
};

export default App;
