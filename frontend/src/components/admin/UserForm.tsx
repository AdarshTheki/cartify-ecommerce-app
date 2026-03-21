import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTitle } from '../../hooks';
import { countries } from '../../utils';
import { axiosInstance, errorHandler } from '../../services';
import { Select, Input, Button } from '../index';

const UserForm = ({ userData }: { userData: UserType | null }) => {
  const [user, setUser] = React.useState({
    email: userData?.email || '',
    password: userData?.password || '',
    fullName: userData?.fullName || '',
    role: userData?.role || '',
    status: userData?.status || '',
    code: userData?.phoneNumber?.split('-')[0] || '',
    phone: userData?.phoneNumber?.split('-')[1] || '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useTitle(`Cartify: ${userData?._id ? 'Update User' : 'Add New User'}`);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    let response;
    try {
      if (userData?._id) {
        response = await axiosInstance.patch(`/user/admin/${userData._id}`, {
          ...user,
          phoneNumber: `${user.code}-${user.phone}`,
        });
      } else {
        response = await axiosInstance.post('/user/admin', {
          ...user,
          phoneNumber: `${user.code}-${user.phone}`,
        });
      }
      if (response.data) {
        navigate('/admin/users');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='max-w-xl space-y-5 mx-auto p-10 shadow' onSubmit={handleSubmit}>
      <h2 className='text-2xl font-medium'>{user?.email ? 'User Update' : 'Create User'}</h2>
      <Input
        name='fullName'
        label='Full Name'
        onChange={handleChange}
        type='text'
        value={user.fullName}
        required={true}
      />

      <div className='grid grid-cols-3 gap-4'>
        <div className='grid gap-1'>
          <p className='capitalize text-sm font-medium text-gray-700'>Role</p>
          <Select
            className='w-[120px]'
            list={['customer', 'seller', 'user']}
            onSelected={(e: string) => setUser({ ...user, role: e })}
            selected={user.role || 'select role'}
          />
        </div>
        <div className='grid gap-1'>
          <p className='capitalize text-sm font-medium text-gray-700'>status</p>
          <Select
            className='w-[120px]'
            list={['active', 'inactive']}
            onSelected={(e: string) => setUser({ ...user, status: e })}
            selected={user.status || 'select status'}
          />
        </div>
        <div className='grid gap-1'>
          <p className='capitalize text-sm font-medium text-gray-700'>country</p>
          <Select
            className='right-0 !w-[160px]'
            list={countries.map((i) => i.title)}
            selected={user.code || 'select country'}
            onSelected={(e: string) => setUser({ ...user, code: e })}
          />
        </div>
      </div>

      <Input
        label='Email'
        name='email'
        type='email'
        onChange={handleChange}
        value={user.email}
        required={true}
      />

      {!userData?._id && (
        <Input
          label='password'
          name='password'
          onChange={handleChange}
          type='text'
          value={user.password}
          required={true}
        />
      )}
      <Input
        label='Phone Number'
        type='number'
        name='phone'
        placeholder='Enter Phone Number'
        onChange={handleChange}
        value={user.phone}
        required={true}
      />
      <div className='flex gap-5 items-center mt-10'>
        <Button type='button' text='Cancel' onClick={() => navigate('/admin/users')} />
        <Button
          type='submit'
          text={loading ? 'loading...' : 'Save User'}
          className='bg-gray-800 text-white'
        />
      </div>
    </form>
  );
};

export default UserForm;
