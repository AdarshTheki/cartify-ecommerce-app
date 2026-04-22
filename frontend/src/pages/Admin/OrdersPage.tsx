import { ArrowDownZA, ArrowUpAZ } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input, Select, DataTable } from '../../components';
import { useApi } from '../../hooks';
import type { TableColumn, Order, Pagination, TableQuery } from '../../types';
import { format } from 'date-fns';

const defaultQuery: TableQuery = {
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'updatedAt',
  sortOrder: 'asc',
  select: '',
};

export default function OrdersPage() {
  const [query, setQuery] = useState<TableQuery>(defaultQuery);
  const [search, setSearch] = useState('');
  const { callApi, data, error, loading } = useApi<Pagination<Order>>();

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        page: 1,
        search,
      }));
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    callApi(`/order`, 'get', { ...query, sort: query.sortBy, order: query.sortOrder });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSort = (key: string) => {
    setQuery((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns: TableColumn<Order>[] = [
    {
      header: '#',
      render: (_, index) => (query.page - 1) * query.limit + (index + 1),
    },
    {
      header: 'Customer',
      render: (order) => order.addressId.title,
    },
    {
      header: 'City',
      render: ({ addressId }) => `${addressId.city}, ${addressId.country}`,
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
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Order Listing</h2>
      <div className='flex gap-2 max-w-sm'>
        <Input
          value={search}
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
          placeholder='Search...'
        />
        <Select
          className='!w-[200px] max-sm:right-0 max-h-[400px]'
          selected={query.sortBy as string}
          label={'Filters'}
          list={['status', 'updatedAt', 'createdAt']}
          onSelected={(v) => setQuery((prev) => ({ ...prev, sortBy: v }))}
        />
        <button
          onClick={() =>
            setQuery((prev) => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))
          }
          className='btn text-gray-800 border !border-gray-400 !rounded-lg'>
          {query.sortOrder === 'asc' ? <ArrowDownZA size={18} /> : <ArrowUpAZ size={18} />}
        </button>
      </div>

      <DataTable
        loading={loading}
        error={error}
        data={data?.docs || []}
        columns={columns}
        totalDocs={data?.totalDocs || 0}
        page={query?.page}
        limit={query?.limit}
        onPageChange={handlePageChange}
        onSort={handleSort}
      />
    </div>
  );
}
