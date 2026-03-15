import { createBrowserRouter } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import {
  MessengerPage,
  AdminPanel,
  GalleryPage,
  HomePage,
  ForgotPasswordRequest,
  OrderListing,
  ProfileSetting,
  ShoppingCart,
  AuthLogin,
  OrderSuccess,
  ResetPasswordPage,
  AuthRegister,
  ProductListing,
  S3FileManager,
  UserFavoritePage,
  CategoryListing,
  ProductsPage,
  SettingPage,
  CategoryUpdating,
  OrderFailed,
  ProductUpdating,
  ShippingAddress,
  CustomerListing,
  CustomerUpdating,
  EmailVerifyPage,
  SingleProductPage,
} from '../pages';
import * as AI from '../pages/AITools';

import AIToolsLayout from './AIToolsLayout';
import AdminPanelLayout from './AdminPanelLayout';
import EcommerceLayout from './EcommerceLayout';
import ProtectedRoute from './ProtectedRoute';

export default function RootLayout() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  return createBrowserRouter([
    {
      path: '/',
      element: user?.role === 'admin' ? <AdminPanelLayout /> : <EcommerceLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'login', element: <AuthLogin /> },
        { path: 'register', element: <AuthRegister /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'order-failed', element: <OrderFailed /> },
        { path: 'order-success', element: <OrderSuccess /> },
        { path: 'reset-password/:resetToken', element: <ResetPasswordPage /> },
        { path: 'forgot-password', element: <ForgotPasswordRequest /> },
        { path: 'verify-email/:verificationToken', element: <EmailVerifyPage /> },
        {
          element: <ProtectedRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            { path: 'products/:id', element: <SingleProductPage /> },
            { path: 'cart', element: <ShoppingCart /> },
            { path: 'shipping-address', element: <ShippingAddress /> },
            { path: 'setting', element: <SettingPage /> },
            { path: 'favorite', element: <UserFavoritePage /> },
            { path: 'messenger', element: <MessengerPage /> },
            { path: 'file-manager', element: <S3FileManager /> },
            { path: 'gallery', element: <GalleryPage /> },
          ],
        },
        {
          path: 'ai',
          element: <ProtectedRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            {
              element: <AIToolsLayout />,
              children: [
                { index: true, element: <AI.AIDashboard /> },
                { path: 'article-writer', element: <AI.WriteArticles /> },
                { path: 'title-generator', element: <AI.BlogTitles /> },
                { path: 'image-generator', element: <AI.ImageGenerator /> },
                {
                  path: 'image-editor',
                  element: <AI.ImageTransform />,
                },
                { path: 'resume-reviewer', element: <AI.ReviewResume /> },
              ],
            },
          ],
        },
        {
          path: 'admin',
          element: <ProtectedRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            { index: true, element: <AdminPanel /> },
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
        {
          path: '*',
          element: <h1 className='text-center mt-20 text-3xl'>404 - Page Not Found</h1>,
        },
      ],
    },
  ]);
}
