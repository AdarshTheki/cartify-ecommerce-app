import { Download, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { downloadOrdersAsCSV } from '../../../utils';
import { useApi } from '../../../hooks';
import { api, errorHandler } from '../../../services';
import type { TableColumn, Order, Pagination } from '../../../types';
import { format } from 'date-fns';
import { DataTable } from '../../../components';

export default function RecentOrders() {
  const { callApi, data, error, loading } = useApi<Pagination<Order>>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callApi('/order?page=1&limit=10&sort=createdAt&order=desc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadCSV = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/dashboard/download/order');
      if (res.data) {
        downloadOrdersAsCSV(res.data.data);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableColumn<Order>[] = [
    {
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      header: 'Customer',
      render: ({ addressId }) => <span className='capitalize'>{addressId.title}</span>,
    },
    {
      header: 'Totals $',
      render: (order) => order.totalPrice | 1,
    },
    {
      header: 'Payment',
      render: ({ paymentId }) => `${paymentId.method} - ${paymentId.status}`,
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Creation',
      render: (order) => format(new Date(order.createdAt), 'PP, p'),
    },
  ];

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

      <DataTable
        columns={columns}
        data={data?.docs || []}
        limit={10}
        page={1}
        onPageChange={() => {}}
        onSort={() => {}}
        totalDocs={data?.totalDocs || 0}
        error={error}
        loading={loading}
      />
    </div>
  );
}
