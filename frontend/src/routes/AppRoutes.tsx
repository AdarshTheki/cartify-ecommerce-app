import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import {
  MessengerPage,
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
  ProfilePage,
} from '../pages';

import * as AI from '../pages/AITools';
import * as Admin from '../pages/Admin';

import PrivateRoute from './PrivateRoute';
import RootLayout from '../components/layout/RootLayout';
import ImageGalleryPage from '../pages/ImageGallery/ImageGalleryPage';

export default function AppRoutes() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  return createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
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
            { path: 'carts', element: <ShoppingCart /> },
            { path: 'shipping-address', element: <AddressListing /> },
            { path: 'shipping-address/create', element: <AddressCreate /> },
            { path: 'shipping-address/:id', element: <AddressUpdate /> },
            { path: 'favorites', element: <UserFavoritePage /> },
            { path: 'messenger', element: <MessengerPage /> },
            { path: 'profile', element: <ProfilePage /> },
          ],
        },
        {
          path: 'tools',
          element: <PrivateRoute isAuth={isAuthenticated} role={user?.role} />,
          children: [
            {
              element: <Outlet />,
              children: [
                { index: true, element: <AI.AIDashboard /> },
                { path: 'file-manager', element: <S3FileManager /> },
                { path: 'image-gallery', element: <ImageGalleryPage /> },
                { path: 'image-generator', element: <AI.ImageGenerator /> },
                { path: 'image-editor', element: <AI.ImageTransform /> },
                { path: 'resume-reviewer', element: <AI.ReviewResume /> },
                { path: 'text-generator', element: <AI.TextGenerator /> },
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
