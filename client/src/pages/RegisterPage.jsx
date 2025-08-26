import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, UserCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const { registerLoading, handleRegister, isError } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email.split('@')[0], email, password, confirmPassword);
  };

  return (
    <section className="flex items-center justify-center p-4 min-h-[80vh]">
      <div className="max-w-md w-full bg-white/50 rounded-3xl border border-white/20 shadow-2xl p-8">
        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>

        {isError && <p className="text-red-600 text-center mb-5">{isError}</p>}

        <form id="registerForm" className="space-y-4" onSubmit={handleSubmit}>
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

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={visible ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          <button
            disabled={registerLoading}
            type="submit"
            className="w-full flex gap-2 items-center justify-center font-medium bg-indigo-600 rounded-xl text-white py-2 hover:bg-indigo-700 disabled:bg-indigo-300 transition">
            {registerLoading ? <Loader2 /> : <UserCircle />} Register User
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 pl-2 hover:text-blue-800 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
