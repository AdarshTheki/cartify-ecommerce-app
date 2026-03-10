import { useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { axiosInstance, errorHandler } from '../utils';
import { login } from '../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

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

      const res = await axiosInstance.post('/user/sign-in', {
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
      errorHandler(error as AxiosError);
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

      const { data } = await axiosInstance.post('/user/sign-up', {
        fullName,
        email,
        password,
        role: 'seller',
      });

      if (data) {
        await handleLogin(email, password, false);
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateProfile = async (email: string, fullName: string) => {
    try {
      setFullNameAndEmailLoading(true);
      const res = await axiosInstance.patch('/user/update', {
        email,
        fullName,
      });
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, email, fullName } as UserType));
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setFullNameAndEmailLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setPasswordLoading(true);
      await axiosInstance.post('/user/password', {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await axiosInstance.post('/user/avatar', formData);
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, avatar: data.avatar } as UserType));
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (error) {
      errorHandler(error as AxiosError);
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
