import { createBrowserRouter } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import {
  MessengerPage,
  GalleryPage,
  HomePage,
  ForgotPasswordRequest,
  ShoppingCart,
  AuthLogin,
  OrderSuccess,
  ResetPasswordPage,
  AuthRegister,
  S3FileManager,
  UserFavoritePage,
  ProductsPage,
  OrderFailed,
  EmailVerifyPage,
  SingleProductPage,
  AddressCreate,
  AddressUpdate,
  AddressListing,
} from '../pages';

import * as AI from '../pages/AITools';
import * as Admin from '../pages/Admin';
import AIToolsLayout from '../components/layout/AIToolsLayout';
import AdminPanelLayout from '../components/layout/AdminPanelLayout';
import EcommerceLayout from '../components/layout/EcommerceLayout';
import PrivateRoute from './PrivateRoute';

import SettingPage from '../pages/profile/SettingPage';

export default function AppRoutes() {
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
          element: <PrivateRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            { path: 'products/:id', element: <SingleProductPage /> },
            { path: 'cart', element: <ShoppingCart /> },
            { path: 'shipping-address', element: <AddressListing /> },
            { path: 'shipping-address/create', element: <AddressCreate /> },
            { path: 'shipping-address/:id', element: <AddressUpdate /> },
            { path: 'favorite', element: <UserFavoritePage /> },
            { path: 'messenger', element: <MessengerPage /> },
            { path: 'file-manager', element: <S3FileManager /> },
            { path: 'gallery', element: <GalleryPage /> },
            { path: 'setting', element: <SettingPage /> },
          ],
        },
        {
          path: 'ai',
          element: <PrivateRoute isAuth={isAuthenticated} role={user?.role} />,
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
          element: <PrivateRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            { index: true, element: <Admin.DashboardPage /> },
            { path: 'products/create', element: <Admin.ProductCreatePage /> },
            { path: 'users/create', element: <Admin.UserCreatePage /> },
            { path: 'categories/create', element: <Admin.CategoryCreatePage /> },
            { path: 'brands/create', element: <Admin.BrandCreatePage /> },
            { path: 'brands', element: <Admin.BrandsPage /> },
            { path: 'brands/:id', element: <Admin.BrandUpdatePage /> },
            { path: 'categories', element: <Admin.CategoriesPage /> },
            { path: 'categories/:id', element: <Admin.CategoryUpdatePage /> },
            { path: 'users', element: <Admin.UsersPage /> },
            { path: 'users/:id', element: <Admin.UserUpdatePage /> },
            { path: 'products', element: <Admin.ProductsPage /> },
            { path: 'products/:id', element: <Admin.ProductUpdatePage /> },
            { path: 'orders', element: <Admin.OrdersPage /> },
          ],
        },
        {
          path: '*',
          element: (
            <div className='min-h-[80vh] flex items-center justify-center'>
              <h1 className='text-center text-3xl'>404 - Page Not Found</h1>
            </div>
          ),
        },
      ],
    },
  ]);
}
