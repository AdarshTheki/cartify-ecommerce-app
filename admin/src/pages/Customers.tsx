import { ChevronLeftIcon, ChevronRightIcon, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';

import { useFetch, useTitle } from '../hooks';
import { Input, Loading, NotFound, Select } from '../components/ui';
import { UserCard } from '@/components';

const customerOptions = [
  { label: 'Name: A → Z', value: 'fullName-asc' },
  { label: 'Name: Z → A', value: 'fullName-desc' },
  { label: 'Email: A → Z', value: 'email-asc' },
  { label: 'Email: Z → A', value: 'email-desc' },
  { label: 'Created: Oldest First', value: 'createdAt-asc' },
  { label: 'Created: Newest First', value: 'createdAt-desc' },
];

const Customers = () => {
  const [sortBy, setSortBy] = useState<string>('Name: A → Z');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useTitle('Cartify: Users Listing');

  function getLabelByValue(value: string) {
    const item = customerOptions.find((el) => el.label === value);
    return item ? item.value : 'Unknown';
  }

  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    query: search || '',
    sort: getLabelByValue(sortBy)?.split('-')[0],
    order: getLabelByValue(sortBy)?.split('-')[1],
  });

  const { data, error, loading } = useFetch<PaginationType<UserType>>(
    `/user/admin?${params.toString()}`
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users Listing</h2>
        <NavLink
          to={`/customer/create`}
          className="bg-gray-800 border text-sm flex items-center gap-2 border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300">
          <Plus size={16} /> Add User
        </NavLink>
      </div>

      {/* Filter products */}
      <div className="flex gap-4 justify-between max-md:flex-col">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            type="text"
            placeholder="User search..."
          />
          <Select
            className="!w-[200px] max-sm:right-0 max-h-[400px]"
            selected={sortBy}
            label={'Filters'}
            list={customerOptions.map((i) => i.label)}
            onSelected={setSortBy}
          />
        </div>
        <div className="flex gap-2 text-nowrap items-center justify-between">
          <Select
            list={['10', '20', '30', '40', '50']}
            label={'Rows - ' + limit.toString()}
            selected={limit.toString()}
            onSelected={(e: string) => setLimit(+e)}
          />
          <p>
            {(page - 1) * limit || 1} - {limit * page} of {data?.totalDocs}
          </p>
          <button
            disabled={!data?.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="svg-btn">
            <ChevronLeftIcon />
          </button>
          <button
            disabled={!data?.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="svg-btn">
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {loading && <Loading />}

      {error && <NotFound title={JSON.stringify(error)} />}

      {!loading && data?.totalDocs && <UserCard items={data.docs} />}
    </div>
  );
};

export default Customers;
