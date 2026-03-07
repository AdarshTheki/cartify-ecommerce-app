import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RootLayout from './RootLayout';
import * as Page from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'login', element: <Page.AuthLogin /> },
      { path: 'register', element: <Page.AuthRegister /> },
      { path: 'contact', element: <h2>Conact Page</h2> },
      {
        path: 'admin',
        element: <ProtectedRoute role='admin' />,
        children: [
          { index: true, element: <Page.AdminDashboard /> },
          { path: 'categories', element: <Page.CategoryListing /> },
          { path: 'categories/:id', element: <Page.CategoryUpdating /> },
          { path: 'brands', element: <Page.CategoryListing /> },
          { path: 'brands/:id', element: <Page.CategoryUpdating /> },
          { path: 'users', element: <Page.CustomerListing /> },
          { path: 'users/:id', element: <Page.CustomerUpdating /> },
          { path: 'products', element: <Page.ProductListing /> },
          { path: 'products/:id', element: <Page.ProductUpdating /> },
          { path: 'orders', element: <Page.OrderListing /> },
          { path: 'profile', element: <Page.ProfileSetting /> },
        ],
      },
    ],
  },
]);

export default router;
