import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axios } from '../config';

const EmailVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { verificationToken } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!verificationToken) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const res = await axios.get(`/user/verify-email/${verificationToken}`);
        if (res.data) {
          setStatus('success');
          setMessage('Email verified successfully!');
          if (user) {
            dispatch({ ...user, isEmailVerified: true });
            navigate('/setting');
          } else {
            window.location.href = '/setting';
          }
        }
      } catch (err) {
        setStatus('error');
        setMessage(
          'Verification failed. ' + err.response.data.message || err.message
        );
        console.log(err);
      }
    };

    verifyEmail();
  }, [verificationToken, user, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <h2 className="text-lg font-semibold text-green-600">✅ Success</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">
              Redirecting to login...
            </p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2 className="text-lg font-semibold text-red-600">❌ Error</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
