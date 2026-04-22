import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Basic strength indicator (returns string)
  const passwordStrength = (pw: string) => {
    if (!pw) return '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[\W_]/.test(pw)) score++;
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetToken) {
      setError('Reset token not found in URL.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/user/reset-password/${resetToken}`, {
        newPassword: password,
      });
      if (data) {
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6'>
        <h2 className='text-2xl font-semibold text-slate-800 mb-2'>Reset Your Password</h2>
        <p className='text-sm text-slate-500 mb-6'>
          Set a new password for your account. This link will expire shortly.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='password' className='block text-sm font-medium mb-1'>
              New Password
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                placeholder='Enter new password'
                aria-describedby='pw-note'
              />
              <button
                type='button'
                onClick={() => setShowPassword((s) => !s)}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700'
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {password && (
              <p id='pw-note' className='mt-2 text-xs text-slate-500'>
                Strength:{' '}
                <strong
                  className={
                    passwordStrength(password) === 'Strong'
                      ? 'text-green-600'
                      : passwordStrength(password) === 'Good'
                        ? 'text-emerald-500'
                        : passwordStrength(password) === 'Fair'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                  }>
                  {passwordStrength(password)}
                </strong>
              </p>
            )}
          </div>

          <div>
            <label htmlFor='confirm' className='block text-sm font-medium mb-1'>
              Confirm Password
            </label>
            <input
              id='confirm'
              name='confirm'
              type='password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
              placeholder='Re-enter new password'
            />
          </div>

          {error && <div className='text-sm text-red-600'>{error}</div>}
          {successMsg && <div className='text-sm text-green-600'>{successMsg}</div>}

          <div>
            <button
              type='submit'
              disabled={loading}
              className='w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-70'>
              {loading && (
                <svg
                  className='w-4 h-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v8H4z'></path>
                </svg>
              )}
              <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
            </button>
          </div>
        </form>

        <div className='mt-4 text-center text-sm text-slate-500'>
          <button
            type='button'
            onClick={() => navigate('/login')}
            className='underline hover:text-slate-700'>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
