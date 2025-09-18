import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { Input, Loading, NotFound, Select } from '../components/ui';
import { useFetch, useDebounce, useTitle } from '../hooks';
import { CategoryCard } from '@/components';

const categoryOption = [
  { label: 'Title: A → Z', value: 'title-asc' },
  { label: 'Title: Z → A', value: 'title-desc' },
  { label: 'Date: Oldest First', value: 'createdAt-asc' },
  { label: 'Date: Newest First', value: 'createdAt-desc' },
];

const CategoryListing = () => {
  const { pathname, search } = useLocation();
  const path = pathname.split('/').join('');
  const [sortBy, setSortBy] = useState<string>('Title: A → Z');
  const [query, setQuery] = useState<string>(search.replace('?q=', '') || '');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const q = useDebounce(query, 500);
  useTitle(`Cartify: ${path} Listing`);

  function getLabelByValue(value: string) {
    const item = categoryOption.find((el) => el.label === value);
    return item ? item.value : 'Unknown';
  }

  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    title: q || '',
    sort: getLabelByValue(sortBy)?.split('-')[0],
    order: getLabelByValue(sortBy)?.split('-')[1],
  });

  const { data, error, loading } = useFetch<PaginationType<CategoryType>>(
    `/${path}?${params.toString()}`
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{path} Listing</h2>
        <NavLink
          to={`${pathname}/create`}
          className="bg-gray-800 border text-sm flex items-center gap-2 border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300">
          <Plus size={16} /> <span>Add {path}</span>
        </NavLink>
      </div>

      {/* Filter products */}
      <div className="flex gap-2 justify-between max-md:flex-col">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            type="text"
            placeholder="Search..."
          />
          <Select
            className="!w-[200px] max-sm:right-0 max-h-[400px]"
            selected={sortBy}
            label={'Filters'}
            list={categoryOption.map((i) => i.label)}
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

      {loading ? <Loading /> : null}

      {error ? <NotFound title={JSON.stringify(error)} /> : null}

      {!loading && data?.totalDocs ? <CategoryCard items={data?.docs} /> : null}
    </div>
  );
};
export default CategoryListing;
