import { axiosInstance, errorHandler } from '../services';
import { PackageSearch } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Select } from './ui';
import { formateTime } from '../utils';

export default function OrderList({ items }: { items: OrderType[] }) {
  const [users, setUsers] = useState<OrderType[]>((items?.length > 0 && items) || []);

  const handleStatusChange = async (orderId: string, status: OrderStatusEnum) => {
    try {
      const res = await axiosInstance.patch(`/order/${orderId}/status`, { status });
      if (res.data) {
        setUsers((prev) => prev.map((p) => (p._id == orderId ? { ...p, status } : p)));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const capitalizeChar = (str = '') =>
    str
      ?.split(' ')
      ?.map((i) => i.charAt(0).toUpperCase() + i?.slice(1, 100).toLowerCase())
      ?.join(' ');

  if (items?.length === 0) {
    return (
      <div className='flex items-center justify-center p-6'>
        <div className='p-8 max-w-md text-center'>
          <PackageSearch className='w-20 h-20 text-gray-400 mb-4 mx-auto' />
          <h2 className='text-2xl font-semibold mb-2'>No Orders Yet</h2>
          <p className='text-gray-600 mb-6'>
            You haven’t placed any orders. Start shopping to place your first order.
          </p>
          <NavLink
            to='/'
            className='bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition'>
            Shop Now
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-gray-300 text-slate-700'>
            <th className='text-left sm:py-3 sm:px-4'>#</th>
            <th className='text-left py-3 px-4'>User</th>
            <th className='text-left py-3 px-4'>Item</th>
            <th className='text-left py-3 px-4'>Payment</th>
            <th className='text-left py-3 px-4'>Status</th>
            <th className='text-left py-3 px-4'>Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((category, index) => (
            <tr key={index} className='border-b text-sm border-gray-100 hover:bg-gray-50'>
              <td className='sm:py-3 sm:px-4'>{index + 1}</td>
              <td className='py-3 px-4 max-w-[200px]'>
                {Object.entries(category.shipping_address)
                  .map(([, b]) => [capitalizeChar(b)])
                  .join(', ')}
              </td>
              <td className='p-2 flex items-center gap-2 max-w-[250px] min-w-[200px]'>
                <ul className='ml-4 list-disc'>
                  {category.items.map((item, index) => (
                    <li key={index} className='flex gap-2 items-center text-sm'>
                      <img
                        src={item.productId?.thumbnail}
                        alt={item.productId?.title}
                        className='w-12 h-12 object-cover border border-gray-200 rounded-lg'
                      />
                      <div>
                        <p className='line-clamp-1'>{item.productId?.title}</p>
                        <p>
                          {item.quantity} x {item.productId?.price?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </td>
              <td className='py-3 px-4 text-nowrap'>
                {category.payment.method} - {category.payment.status}
              </td>
              <td className='py-3 text-nowrap w-fit'>
                <Select
                  selected={category.status}
                  list={['pending', 'shipped', 'delivered', 'cancelled']}
                  onSelected={(e) => handleStatusChange(category._id, e as OrderStatusEnum)}
                />
              </td>
              <td className='px-4 py-3'>
                <p className='text-nowrap'>{formateTime(category.createdAt)}</p>
                <p>{formateTime(category.updatedAt)}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
