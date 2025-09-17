import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Lock, ListOrdered, PackageSearch } from 'lucide-react';
import { ForgotPassword, ResendVerifyEmail } from '../components';
import { format, parseISO } from 'date-fns';
import { Input } from '../utils';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const orderStatusMessages = {
  pending:
    'Your order has been placed successfully and is pending confirmation.',
  shipped: 'Good news! Your order has been shipped and is on its way.',
  delivered: 'Your order has been delivered. We hope you enjoy your purchase!',
  cancelled:
    'Your order has been cancelled. If this was a mistake, please contact support.',
};

const OrderCard = React.memo(({ order }) => {
  const formateDate = React.useMemo(() => {
    const date = order.updatedAt;
    const d = typeof date === 'string' ? parseISO(date) : new Date();
    return format(d, 'dd MMMM yyyy');
  }, [order]);

  return (
    <div key={order._id} className="border-b border-gray-300 pb-3 mb-6">
      <h2 className="text-xl font-semibold capitalize">
        {order.status} on {formateDate}
      </h2>

      <p className="py-2">{orderStatusMessages[order.status || 'pending']}</p>

      <div className="capitalize mb-2">
        <p>
          Payment: {order.payment.method?.toUpperCase()} -{' '}
          {order.payment.status}
        </p>
        <p>Customer: {order.shipping_address.name?.toLowerCase()}</p>
        <p>Total: ${order?.totalPrice}</p>
      </div>

      <p className="mb-2">
        {order.shipping_address.line1}, {order.shipping_address.line2},
        <br />
        {order.shipping_address.city} - {order.shipping_address.postal_code},{' '}
        {order.shipping_address.state}, {order.shipping_address.country}
      </p>

      <div className="mt-2">
        <ul className="ml-4 list-disc">
          {order.items.map((item, index) => (
            <li key={index} className="flex gap-3 items-center mt-2">
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                className="w-16 h-16 object-contain"
              />
              <div className="text-sm">
                <a
                  className="text-indigo-700"
                  href={`/products/${item.productId}`}>
                  {item.product.title}
                </a>
                <p>
                  {item.quantity} x {item.product.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { data, callApi } = useApi();

  const navList = [
    { name: 'profile', icon: <User size={18} /> },
    { name: 'security', icon: <Lock size={18} /> },
    { name: 'orders', icon: <ListOrdered size={18} /> },
  ];

  useEffect(() => {
    callApi('/order/user', {}, 'get');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case navList[0].name:
        return <ProfileTab />;
      case navList[1].name:
        return <Security />;
      case navList[2].name:
        return <OrdersTab orders={data || []} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <nav className="flex sm:gap-2 p-4 items-center">
        {navList.map((li) => (
          <button
            key={li.name}
            onClick={() => setActiveTab(li.name)}
            className={`flex gap-2 capitalize items-center p-2 px-4 font-medium text-left rounded-lg transition-colors duration-200 ${activeTab === li.name ? 'bg-indigo-600 text-white' : 'text-gray-00 hover:bg-gray-200'}`}>
            {li.icon}
            {li.name}
          </button>
        ))}
      </nav>
      <div className="w-full p-4 min-h-[80vh]">{renderContent()}</div>
    </div>
  );
}

const ProfileTab = () => {
  const { user, handleUpdateProfile, handleUploadAvatar, avatarLoading } =
    useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber?.split('-')[1] || '');

  const onAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadAvatar(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="">
        <h2 className="text-xl font-bold text-gray-800 my-6">Avatar</h2>
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://avatar.iran.liara.run/public'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <div>
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer w-80 text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              {avatarLoading ? 'Uploading...' : 'Change Avatar'}
            </label>
            <input
              name="avatar-upload"
              id="avatar-upload"
              type="file"
              className="hidden"
              onChange={onAvatarChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300"></div>

      <div className=" space-y-4">
        <h2 className="text-xl font-bold text-gray-800 my-6">
          Other Information
        </h2>
        <Input
          name="fullName"
          label="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          name="phone"
          label="Mobile No."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="cursor-pointer text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          onClick={() => handleUpdateProfile(fullName, '+91-' + phone)}>
          Submit
        </button>
      </div>
    </div>
  );
};

const Security = () => {
  const { handleLogout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mx-auto w-full">
      <ForgotPassword />

      <div className="border-b border-gray-300 my-5"></div>

      <ResendVerifyEmail />

      <div className="border-b border-gray-300 my-5"></div>

      {/* logout user */}
      <div className="">
        <h2 className="text-xl font-bold text-gray-800 my-6"> Logout</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to log out of your account?
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200">
          Logout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <h4 className="text-lg font-bold mb-4">Confirm Logout</h4>
            <p className="text-gray-600 mb-6">
              You will be returned to the login page.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersTab = ({ orders = [] }) => {
  return (
    <div className="container mx-auto">
      {!orders?.length && (
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="p-8 max-w-md text-center">
            <PackageSearch className="w-20 h-20 text-gray-400 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven’t placed any orders. Start shopping to place your first
              order.
            </p>
            <NavLink
              to="/"
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition">
              Shop Now
            </NavLink>
          </div>
        </div>
      )}
      {orders?.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};
