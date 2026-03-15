import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchCurrentUser } from './redux/authSlice';
import { fetchBrands } from './redux/brandSlice';
import { fetchCategories } from './redux/categorySlice';
import { fetchProducts } from './redux/productSlice';
import { useAppDispatch } from './redux/store';
import router from './layouts/RootLayout';

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
