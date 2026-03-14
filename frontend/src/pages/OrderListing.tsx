import { useFetch, useTitle } from '../hooks';
import { Loading, Select } from '../components/ui';
import { OrderList } from '../components';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function Orders() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const sortBy = 'createdAt-asc';

  useTitle('Cartify: Order History');

  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    sort: sortBy.split('-')[0],
    order: sortBy.split('-')[1],
  });

  const { data, loading } = useFetch<OrderType[]>(`/order?${params.toString()}`);

  return (
    <div className='space-y-4 min-h-screen'>
      <h2 className='text-2xl font-semibold'>Orders Listing</h2>

      {/* Filter products */}
      <div className='flex gap-2 sm:justify-end items-center'>
        <Select
          list={['10', '20', '30', '40', '50']}
          label={'Rows - ' + limit.toString()}
          selected={limit.toString()}
          onSelected={(e) => setLimit(+e)}
        />
        <p>
          {(page - 1) * limit || 1} - {limit * page} of {data?.length}
        </p>
        <button disabled={true} onClick={() => setPage((p) => p - 1)} className='svg-btn'>
          <ChevronLeftIcon />
        </button>
        <button disabled={true} onClick={() => setPage((p) => p + 1)} className='svg-btn'>
          <ChevronRightIcon />
        </button>
      </div>

      {loading ? <Loading /> : <OrderList items={data || []} />}
    </div>
  );
}
