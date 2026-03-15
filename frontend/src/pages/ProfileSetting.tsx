import { User, Lock, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth, useTitle } from '../hooks';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  useTitle('Cartify: User Setting');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'password':
        return <PasswordTab />;
      case 'logout':
        return <LogoutTab />;
      default:
        return null;
    }
  };

  return (
    <div className='max-w-4xl mx-auto lg:p-8'>
      <div className='bg-white shadow-lg overflow-hidden min-h-[80dvh]'>
        <div className='md:flex'>
          <div className='w-full md:w-1/4 bg-gray-50 p-6'>
            <nav className='space-y-2  gap-2'>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}>
                <User className='mr-3' size={20} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === 'password'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}>
                <Lock className='mr-3' size={20} />
                Password
              </button>
              <button
                onClick={() => setActiveTab('logout')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === 'logout'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}>
                <LogOut className='mr-3' size={20} />
                Logout
              </button>
            </nav>
          </div>
          <div className='w-full md:w-3/4 p-6'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

const ProfileTab = () => {
  const { user, handleUpdateProfile, handleUploadAvatar, fullNameAndEmailLoading, avatarLoading } =
    useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');

  const onProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile(email, fullName);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadAvatar(e.target.files[0]);
    }
  };

  return (
    <div>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>Profile Information</h3>
      <div className='flex items-center mb-6'>
        <img
          src={user?.avatar || 'https://avatar.iran.liara.run/public'}
          alt='Avatar'
          className='w-24 h-24 rounded-full object-cover mr-6'
        />
        <div>
          <label
            htmlFor='avatar-upload'
            className='cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200'>
            {avatarLoading ? 'Uploading...' : 'Change Avatar'}
          </label>
          <input
            id='avatar-upload'
            type='file'
            className='hidden'
            onChange={onAvatarChange}
            accept='image/*'
          />
        </div>
      </div>
      <form onSubmit={onProfileSubmit} className='space-y-4'>
        <div>
          <label htmlFor='fullName' className='block text-sm font-medium text-gray-700'>
            Full Name
          </label>
          <input
            type='text'
            id='fullName'
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <button
          type='submit'
          disabled={fullNameAndEmailLoading}
          className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'>
          {fullNameAndEmailLoading ? 'Saving...' : 'Save Change'}
        </button>
      </form>
    </div>
  );
};

const PasswordTab = () => {
  const { handleChangePassword, passwordLoading } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChangePassword(oldPassword, newPassword);
  };

  return (
    <div>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>Change Password</h3>
      <form onSubmit={onPasswordSubmit} className='space-y-4'>
        <div>
          <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-700'>
            Old Password
          </label>
          <input
            type='password'
            id='oldPassword'
            value={oldPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <div>
          <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
            New Password
          </label>
          <input
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <button
          type='submit'
          disabled={passwordLoading}
          className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'>
          {passwordLoading ? 'Saving...' : 'Save Change'}
        </button>
      </form>
    </div>
  );
};

const LogoutTab = () => {
  const { handleLogout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>Logout</h3>
      <p className='text-gray-600 mb-4'>Are you sure you want to log out of your account?</p>
      <button
        onClick={() => setShowModal(true)}
        className='w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'>
        Logout
      </button>

      {showModal && (
        <div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 shadow-2xl'>
            <h4 className='text-lg font-bold mb-4'>Confirm Logout</h4>
            <p className='text-gray-600 mb-6'>You will be returned to the login page.</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200'>
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200'>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
