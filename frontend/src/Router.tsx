import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RootLayout from './RootLayout';

import {
  CategoryListing,
  CategoryUpdating,
  CustomerListing,
  CustomerUpdating,
  OrderListing,
  ProductListing,
  ProductUpdating,
  ProfileSetting,
  AdminDashboard,
  AuthLogin,
  AuthRegister,
  Home,
  EmailVerifyPage,
  S3FileManager,
  ForgotPasswordRequest,
  OrderFailed,
  OrderSuccess,
  ProductsPage,
  ResetPasswordPage,
  SettingPage,
  ShippingAddress,
  ShoppingCart,
  UserFavoritePage,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <AuthLogin /> },
      { path: 'register', element: <AuthRegister /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <h2>Single Products Page</h2> },
      { path: 'gallery', element: <h2>Gallery Page</h2> },
      { path: 'order-failed', element: <OrderFailed /> },
      { path: 'order-success', element: <OrderSuccess /> },
      { path: 'reset-password/:resetToken', element: <ResetPasswordPage /> },
      { path: 'forgot-password', element: <ForgotPasswordRequest /> },
      { path: 'verify-email', element: <EmailVerifyPage /> },
      { path: 'file-manager', element: <S3FileManager /> },
      {
        element: <ProtectedRoute role='customer' />,
        children: [
          { path: 'cart', element: <ShoppingCart /> },
          { path: 'shipping-address', element: <ShippingAddress /> },
          { path: 'setting', element: <SettingPage /> },
          { path: 'favorite', element: <UserFavoritePage /> },
        ],
      },
      {
        path: 'admin',
        element: <ProtectedRoute role='admin' />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'categories', element: <CategoryListing /> },
          { path: 'categories/:id', element: <CategoryUpdating /> },
          { path: 'brands', element: <CategoryListing /> },
          { path: 'brands/:id', element: <CategoryUpdating /> },
          { path: 'users', element: <CustomerListing /> },
          { path: 'users/:id', element: <CustomerUpdating /> },
          { path: 'products', element: <ProductListing /> },
          { path: 'products/:id', element: <ProductUpdating /> },
          { path: 'orders', element: <OrderListing /> },
          { path: 'profile', element: <ProfileSetting /> },
        ],
      },
    ],
  },
]);

export default router;
