import { useState } from 'react';
import { useSelector } from 'react-redux';
import { axios } from '../config';
import { Input } from '../utils';

const ResendVerifyEmail = () => {
  const { user } = useSelector((s) => s.auth);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.get('/user/resend-verify-email');
      if (res.data) setMessage('Mail has been sent to your mail ID');
    } catch (err) {
      setMessage(
        err.response.data.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Resend Verify</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Email Verify"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            readOnly
          />
        </div>

        <p style={{ lineHeight: 1 }} className="text-xs font-light">
          Note: Resend your verify email address, Please check you mail box.{' '}
          <a
            target="_blank"
            href="https://mailtrap.io/inboxes/3955250/messages"
            className="text-indigo-700 underline">
            Click
          </a>
        </p>

        <button
          type="submit"
          disabled={loading || user?.isEmailVerified}
          className="w-full bg-indigo-600 rounded-lg text-white py-2 hover:bg-indigo-700 disabled:bg-indigo-300 transition">
          {loading ? 'Loading' : user?.isEmailVerified ? 'verified' : 'Verify'}{' '}
          Email
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-green-700">{message}</p>
      )}
    </div>
  );
};

export default ResendVerifyEmail;
