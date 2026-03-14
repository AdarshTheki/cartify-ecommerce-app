import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTitle } from '../hooks';
import { countries } from '../utils';
import { Select, Input } from './ui';
import { axiosInstance, errorHandler } from '../services';

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
        navigate('/customer');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='max-w-lg space-y-5' onSubmit={handleSubmit}>
      <h2 className='text-2xl font-medium'>{user?.email ? 'User Update' : 'Create User'}</h2>
      <Input
        name='fullName'
        onChange={handleChange}
        type='text'
        value={user.fullName}
        required={true}
      />

      <div className='grid grid-cols-3 gap-4'>
        <Select
          className='w-[120px]'
          list={['customer', 'seller', 'user']}
          onSelected={(e: string) => setUser({ ...user, role: e })}
          selected={user.role || 'select role'}
        />
        <Select
          className='w-[120px]'
          list={['active', 'inactive']}
          onSelected={(e: string) => setUser({ ...user, status: e })}
          selected={user.status || 'select status'}
        />
        <Select
          className='right-0 !w-[160px]'
          list={countries.map((i) => i.title)}
          selected={user.code || 'select country'}
          onSelected={(e: string) => setUser({ ...user, code: e })}
        />
      </div>

      <Input name='email' type='email' onChange={handleChange} value={user.email} required={true} />

      {!userData?._id && (
        <Input
          name='password'
          onChange={handleChange}
          type='text'
          value={user.password}
          required={true}
        />
      )}
      <Input
        type='number'
        name='phone'
        placeholder='Enter Phone Number'
        onChange={handleChange}
        value={user.phone}
        required={true}
      />
      <div className='flex gap-5 items-center mt-5'>
        <button
          type='button'
          onClick={() => navigate('/customer')}
          className='border border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 duration-300'>
          Cancel
        </button>
        <button className='bg-gray-800 border border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300'>
          {loading ? 'loading...' : 'Save User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
