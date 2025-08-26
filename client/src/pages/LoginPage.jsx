import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, UserCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { images } from '../assets';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [visible, setVisible] = useState(false);
  const { loginLoading, handleLogin, isError } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, rememberMe);
  };

  const handleOAuthLogin = (provider) => {
    if (provider === 'guest') {
      handleLogin('guest-user@gmail.com', '123456', true);
    } else {
      const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
      window.location.href = `${BACKEND_URL}/api/v1/user/${provider}`;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('accessToken');
    if (t) {
      localStorage.setItem('accessToken', t);
      window.location.href = '/';
    }
  }, []);

  return (
    <section className="flex items-center justify-center p-4 min-h-[80dvh]">
      <div className="max-w-md w-full bg-white/50 rounded-3xl border border-white/20 shadow-2xl p-8">
        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
          Sign In
        </h1>

        {isError && <p className="text-red-600 text-center py-2">{isError}</p>}

        {/* OAuth Login */}
        <div className="flex gap-1 my-5">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex flex-1 items-center justify-center text-sm font-medium gap-2 hover:opacity-80 duration-200 border px-4 py-2 rounded-xl bg-white text-black hover:shadow-lg">
            <img src={images.google} className="h-4 w-4" /> Google
          </button>

          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex flex-1 items-center justify-center text-sm font-medium gap-2 hover:opacity-80 duration-200 border px-4 py-2 rounded-xl bg-black text-white hover:shadow-lg">
            <img src={images.github} className="h-4 w-4" /> GitHub
          </button>

          <button
            disabled={loginLoading}
            onClick={() => handleOAuthLogin('guest')}
            className="flex flex-1 items-center justify-center text-sm font-medium gap-2 hover:opacity-80 duration-200 border px-4 py-2 rounded-xl bg-indigo-700 text-white hover:shadow-lg">
            {loginLoading ? (
              <Loader2 className="h-4 w-4" />
            ) : (
              <UserCircle className="h-4 w-4" />
            )}
            Guest
          </button>
        </div>

        <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={visible ? 'text' : 'password'}
              id="password"
              name="password"
              required
              className="w-full py-2 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute top-12 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setVisible(!visible)}>
              {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between my-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            disabled={loginLoading}
            type="submit"
            className="w-full flex gap-2 items-center justify-center font-medium bg-indigo-600 rounded-xl text-white py-2 hover:bg-indigo-700 disabled:bg-indigo-300 transition">
            {loginLoading ? <Loader2 /> : <UserCircle />} Login User
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="text-blue-600 pl-2 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
