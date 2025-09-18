import { NavLink, useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ProductCard } from '@/components';
import { Input, NotFound, Select } from '../components/ui';
import useDebounce from '../hooks/useDebounce';
import useFetch from '../hooks/useFetch';
import { useTitle } from '@/hooks';

const productOptions = [
  { label: 'Title: A → Z', value: 'title-asc' },
  { label: 'Title: Z → A', value: 'title-desc' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Stock: High → Low', value: 'stock-desc' },
  { label: 'Stock: Low → High', value: 'stock-asc' },
  { label: 'Status: A → Z', value: 'status-asc' },
  { label: 'Status: Z → A', value: 'status-desc' },
];

export default function Product() {
  const [sortBy, setSortBy] = useState<string>('Title: A → Z');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>('');
  const query = useDebounce(search, 500);

  useTitle('Cartify: Products Listing');

  function getLabelByValue(value: string) {
    const item = productOptions.find((el) => el.label === value);
    return item ? item.value : 'Unknown';
  }

  const { data, loading, error } = useFetch<PaginationType<ProductType>>(
    `/product?title=${query}&page=${page}&limit=${limit}&sortBy=${
      getLabelByValue(sortBy)?.split('-')[0]
    }&order=${getLabelByValue(sortBy)?.split('-')[1]}`
  );

  useEffect(() => {
    const title = searchParams.get('title');
    if (title) setSearch(title);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">Products Listing</h2>
        <NavLink
          to={'/product/create'}
          className="bg-gray-800 border text-sm flex items-center gap-2 border-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300">
          <Plus size={16} /> <span>Add Product</span>
        </NavLink>
      </div>

      {/* Filter products */}
      <div className="flex gap-2 justify-between max-md:flex-col">
        <div className="flex gap-2">
          <Input
            value={search}
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }}
            placeholder="Search..."
          />
          <Select
            className="!w-[200px] max-sm:right-0 max-h-[400px]"
            selected={sortBy}
            label={'Filters'}
            list={productOptions.map((i) => i.label)}
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

      {error && <NotFound title={JSON.stringify(error)} />}

      {!loading && data?.totalDocs ? <ProductCard items={data?.docs} /> : null}
    </div>
  );
}
