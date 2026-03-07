import { AxiosError } from 'axios';
import { Download, Loader } from 'lucide-react';
import { useState } from 'react';
import { downloadOrdersAsCSV, axiosInstance, cn, errorHandler, formateTime } from '../../utils';
import { Skeleton } from '../../ui';
import { useFetch } from '../../hooks';

export default function RecentOrders() {
  const { data, loading } = useFetch<OrderType[]>('/order?page=1&limit=10');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/dashboard/download/order');
      if (res.data) {
        downloadOrdersAsCSV(res.data.data);
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Recent Orders</h2>
        <button
          onClick={handleDownloadCSV}
          className='border text-sm flex items-center gap-2 border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 duration-300'>
          {isLoading ? <Loader size={16} /> : <Download size={16} />} Export
        </button>
      </div>
      {!!loading || !data ? (
        <div className='rounded-lg border animate-pulse bg-white'>
          <Skeleton className='h-7 w-40 mb-6 bg-gray-100 rounded' />
          <div className='grid grid-cols-4 md:gap-20 sm:gap-14 gap-8 mb-4'>
            <Skeleton className='h-4 bg-gray-200' />
            <Skeleton className='h-4 bg-gray-200' />
            <Skeleton className='h-4 bg-gray-200' />
            <Skeleton className='h-4 bg-gray-200' />
          </div>
          {[...Array(10)].map((_, index) => (
            <div key={index} className='grid grid-cols-4 md:gap-14 sm:gap-8 gap-6 mb-2'>
              <Skeleton className='h-4 bg-gray-100' />
              <Skeleton className='h-4 bg-gray-100' />
              <Skeleton className='h-4 bg-gray-100' />
              <Skeleton className='h-4 bg-gray-100' />
            </div>
          ))}
        </div>
      ) : (
        <div className='overflow-x-auto w-full py-4'>
          <table className='w-full'>
            <thead>
              <tr className='text-left border-b'>
                <th className='pb-3 pr-4 text-nowrap'>Customer</th>
                <th className='pb-3 pr-4 text-nowrap text-center'>Status</th>
                <th className='pb-3 pr-4 text-nowrap'>Amount</th>
                <th className='pb-3 pr-4 text-nowrap'>Date</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data?.map((order) => {
                    const name = order.shipping_address.name.toLowerCase();
                    return (
                      <tr key={order._id} className='hover:bg-gray-100'>
                        <td className='py-3 pr-2 capitalize text-nowrap'>{name}</td>
                        <td className='py-3 px-2'>
                          <span
                            className={cn(
                              order.status === 'delivered' && 'status-active',
                              order.status === 'cancelled' && 'status-inactive',
                              order.status === 'pending' && 'status-pending',
                              order.status === 'shipped' && 'status-processing',
                              '',
                            )}>
                            {order.status}
                          </span>
                        </td>
                        <td className='py-3 px-2'>
                          $
                          {[...order.items].reduce(
                            (p, i) => Number(i.quantity) * Number(i.product?.price) + p,
                            0,
                          )}
                        </td>
                        <td className='py-3 text-nowrap'>{formateTime(order.updatedAt)}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
