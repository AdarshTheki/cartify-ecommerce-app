import { useState } from 'react';
import { toast } from 'react-toastify';
import { api, errorHandler } from '../services';
import { login } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { User } from '../types';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [fullNameAndEmailLoading, setFullNameAndEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoginLoading(true);
      if (!email || !password) {
        toast.error('Please fill in all fields.');
        return;
      }

      const res = await api.post('/user/sign-in', {
        email,
        password,
      });
      if (res.data?.data) {
        if (rememberMe) {
          localStorage.setItem('accessToken', res.data?.data?.accessToken);
          sessionStorage.clear();
        } else {
          sessionStorage.setItem('accessToken', res.data?.data?.accessToken);
          localStorage.removeItem('accessToken');
        }
        window.location.href = '/';
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      setRegisterLoading(true);
      if (!fullName || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields.');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      const { data } = await api.post('/user/sign-up', {
        fullName,
        email,
        password,
        role: 'seller',
      });

      if (data) {
        await handleLogin(email, password, false);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateProfile = async (email: string, fullName: string) => {
    try {
      setFullNameAndEmailLoading(true);
      const res = await api.patch('/user/update', {
        email,
        fullName,
      });
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, email, fullName } as User));
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setFullNameAndEmailLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setPasswordLoading(true);
      await api.post('/user/password', {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/user/avatar', formData);
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, avatar: data.avatar } as User));
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (error) {
      errorHandler(error);
    }
  };

  return {
    user,
    avatarLoading,
    fullNameAndEmailLoading,
    passwordLoading,
    registerLoading,
    loginLoading,
    handleUpdateProfile,
    handleChangePassword,
    handleUploadAvatar,
    handleLogout,
    handleRegister,
    handleLogin,
  };
};

export default useAuth;
