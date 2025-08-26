import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axios, errorHandler } from '../config';
import { login, logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const setErrorHandler = (error) => {
    const { response, request, message } = error || {};
    if (response) {
      const status = response.status;
      const errorMsg = response.data?.message || 'Something went wrong.';

      if (status === 401) {
        setIsError('Unauthorized access. Please login again.');
      } else if (status === 403) {
        setIsError("Forbidden. You don't have permission.");
      } else if (status === 404) {
        setIsError('Requested resource not found.');
      } else {
        setIsError(errorMsg);
      }
    } else if (request) {
      setIsError('No response, Please check your network.');
    } else {
      setIsError(message || 'An unexpected error occurred.');
    }
  };

  const handleLogin = async (email, password, rememberMe) => {
    try {
      setIsError(null);
      setLoginLoading(true);
      if (!email || !password) {
        setIsError('Please fill in all fields.');
        return;
      }

      const res = await axios.post('/user/sign-in', { email, password });
      const data = res?.data?.data;
      if (data) {
        if (rememberMe) {
          localStorage.setItem('accessToken', data.accessToken);
          sessionStorage.clear('accessToken');
        } else {
          sessionStorage.setItem('accessToken', data.accessToken);
          localStorage.removeItem('accessToken');
        }
        window.location.href = '/';
      }
    } catch (error) {
      setErrorHandler(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (fullName, email, password, confirmPassword) => {
    try {
      setRegisterLoading(true);
      if (!fullName || !email || !password || !confirmPassword) {
        setIsError('Please fill in all fields.');
        return;
      }

      if (password !== confirmPassword) {
        setIsError('Passwords do not match.');
        return;
      }

      const { data } = await axios.post('/user/sign-up', {
        fullName,
        email,
        password,
        role: 'customer',
      });
      if (data) {
        navigate('/login');
        toast.success('check your email to verify users');
      }
    } catch (error) {
      setErrorHandler(error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateProfile = async (fullName, phoneNumber) => {
    try {
      const res = await axios.patch('/user/update', {
        fullName,
        phoneNumber,
      });
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, fullName, phoneNumber }));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleUploadAvatar = async (file) => {
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await axios.post('/user/avatar', formData);
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, avatar: data.avatar }));
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    await axios.post('/user/logout');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
  };

  const handleResendVerifyUser = async () => {
    try {
      const res = await axios.get('/user/resend-verify-email');
      if (res.data) {
        toast.success('Mail has been sent to your mail ID');
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return {
    user,
    avatarLoading,
    registerLoading,
    loginLoading,
    isError,
    handleResendVerifyUser,
    handleUpdateProfile,
    handleUploadAvatar,
    handleLogout,
    handleRegister,
    handleLogin,
  };
};

export default useAuth;
