import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { axios } from '../config';
import { Input } from '../utils';

const ForgotPasswordRequest = () => {
  const { user } = useSelector((s) => s.auth);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('/user/forgot-password', { email });
      if (res.data)
        setMessage(
          res.data.message || 'Password reset link sent to your email.'
        );
    } catch (err) {
      setMessage(
        err.response.data.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <p style={{ lineHeight: 1 }} className="text-xs font-light">
            Note: Reset your password on send to your email address{' '}
            <a
              target="_blank"
              href="https://mailtrap.io/inboxes/3955250/messages"
              className="text-indigo-700 underline">
              Click
            </a>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 rounded-lg text-white py-2 hover:bg-indigo-700 disabled:bg-indigo-300 transition">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
