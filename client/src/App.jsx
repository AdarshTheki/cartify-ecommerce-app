import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import Pages
import {
  FavoritePage,
  HomePage,
  LoginPage,
  OrderFailed,
  OrderSuccess,
  ProductsPage,
  RegisterPage,
  ShippingAddress,
  ShoppingCartPage,
  SingleProductPage,
  ResetPasswordPage,
  ForgotPasswordPage,
  EmailVerifyPage,
  SettingPage,
  ImageGalleryPage,
  ChatMessagesPage,
  FileManagePage,
} from './pages';
import RootLayout from './RootLayout';

import {
  AIDashboard,
  AILayout,
  BlogTitles,
  GenerateImages,
  ImageTransformations,
  ReviewResume,
  WriteArticles,
} from './pages/AI';

import { Loading, NotFound } from './utils';
import { useEffect, useState } from 'react';

// Protected Layout for authenticated routes
const ProtectedLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <SingleProductPage /> },
      { path: 'gallery', element: <ImageGalleryPage /> },
      { path: 'order/failed', element: <OrderFailed /> },
      { path: 'order/success', element: <OrderSuccess /> },
      { path: 'reset-password/:resetToken', element: <ResetPasswordPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'verify-email/:verificationToken', element: <EmailVerifyPage /> },
      { path: 'file-manager', element: <FileManagePage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: 'cart', element: <ShoppingCartPage /> },
          { path: 'shipping-address', element: <ShippingAddress /> },
          { path: 'setting', element: <SettingPage /> },
          { path: 'favorite', element: <FavoritePage /> },
          { path: 'message', element: <ChatMessagesPage /> },
          {
            path: 'ai',
            element: <AILayout />,
            children: [
              { index: true, element: <AIDashboard /> },
              { path: 'write-articles', element: <WriteArticles /> },
              { path: 'blog-titles', element: <BlogTitles /> },
              { path: 'generate-images', element: <GenerateImages /> },
              {
                path: 'image-transformation',
                element: <ImageTransformations />,
              },
              { path: 'review-resume', element: <ReviewResume /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
