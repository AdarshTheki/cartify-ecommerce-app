/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import useDebounce from '../hooks/useDebounce';
import { Input, Skeleton } from '../utils';
import { ProductItem } from '../components';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Settings,
  Star,
  X,
} from 'lucide-react';

const sortByOptions = [
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
  { label: 'Price (Low to High)', value: 'price-asc' },
  { label: 'Price (High to Low)', value: 'price-desc' },
];

const ProductListing = () => {
  const [params] = useSearchParams();
  const { items: categories } = useSelector((state) => state.categories);
  const { items: brands } = useSelector((state) => state.brands);
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState(params.get('category') || '');
  const [brand, setBrand] = useState(params.get('brand') || '');
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('title-asc');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(params.get('title') || '');
  const query = useDebounce(search, 500);
  const [isOpenSort, setIsOpenSort] = React.useState(false);
  const [mobileView, setMobileView] = React.useState(false);

  const { data, loading, callApi } = useApi();

  // const { data } = useFetch(`/product?${queryParams}`);

  useEffect(() => {
    callApi(
      `/product`,
      {
        ...(category && { category }),
        ...(brand && { brand }),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        ...(rating && {
          minRating: (rating === 5 ? rating - 0.5 : rating).toString(),
          maxRating: (rating === 5 ? rating : rating + 1).toString(),
        }),
        sortBy: sortBy.split('-')[0],
        order: sortBy.split('-')[1],
        page,
        limit,
        title: params.get('title') || query,
      },
      'get'
    );
  }, [
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sortBy,
    page,
    limit,
    params,
    query,
  ]);

  return (
    <section className="p-2 container mx-auto">
      <div className="lg:grid gap-2" style={{ gridTemplateColumns: '1fr 3fr' }}>
        {/* <!-- Filters Sidebar --> */}
        <div
          className={
            mobileView
              ? 'fixed inset-0 bg-black/50 z-30 pt-[30%] duration-300 ease-in' // mobile
              : 'w-full max-lg:hidden lg:sticky lg:h-fit lg:top-[54px]' // desktop
          }>
          <div
            className={
              mobileView
                ? '!p-5 h-full text-gray-800 !rounded-2xl bg-white overflow-auto card flex flex-col gap-4'
                : 'overflow-y-auto scrollbar card text-gray-800  flex flex-col gap-4'
            }>
            <div className="flex items-center justify-between">
              <p className="text-xl font-medium">Sort & Filter</p>
              <X
                className="sm:hidden cursor-pointer"
                onClick={() => setMobileView(false)}
              />
            </div>

            {/* Display filters */}
            {!![category, brand, rating].filter((i) =>
              i?.toString()?.trim()
            )[0] && (
              <div className="inline-flex gap-1 flex-wrap">
                {!!category && (
                  <span
                    onClick={() => setCategory('')}
                    className="status-inactive cursor-pointer">
                    {category} x
                  </span>
                )}
                {!!brand && (
                  <span
                    onClick={() => setBrand('')}
                    className="status-inactive cursor-pointer">
                    {brand} x
                  </span>
                )}
                {!!rating && (
                  <span
                    className="status-inactive cursor-pointer"
                    onClick={() => setRating(0)}>
                    star {rating} x
                  </span>
                )}
              </div>
            )}

            {/* Search Filter */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md px-4">
                <legend className="font-medium uppercase">Search</legend>
                <div className="flex w-full items-center">
                  <Search className="w-4 h-4" />
                  <Input
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="!w-full !border-none"
                    placeholder="Search products..."
                  />
                  {!!search?.length && (
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => setSearch('')}
                    />
                  )}
                </div>
              </fieldset>
            </div>

            {/* sort product */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md py-2 px-4">
                <legend className="font-medium uppercase">Sort By</legend>
                <button
                  type="button"
                  onClick={() =>
                    setIsOpenSort((prev) => (prev === 'sort' ? '' : 'sort'))
                  }
                  className="w-full flex justify-between text-left">
                  <span>
                    {sortByOptions.find((i) => i?.value == sortBy)?.label ||
                      'Select'}
                  </span>
                  {isOpenSort === 'sort' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </fieldset>

              {isOpenSort === 'sort' && (
                <ul className="w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                  {sortByOptions.map((sort) => (
                    <li
                      key={sort.value}
                      className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                      onClick={() => {
                        setSortBy(sort.value);
                        setIsOpenSort('');
                      }}>
                      {sort.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Category product */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md py-2 px-4">
                <legend className="font-medium uppercase">Category</legend>
                <button
                  type="button"
                  onClick={() =>
                    setIsOpenSort((prev) =>
                      prev === 'category' ? '' : 'category'
                    )
                  }
                  className="w-full flex justify-between text-left">
                  <span className="capitalize">
                    {categories?.find((i) => i?.title === category)?.title ||
                      'Select'}
                  </span>
                  {isOpenSort === 'category' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </fieldset>

              {isOpenSort === 'category' && (
                <ul className="w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                  {categories?.map((sort) => (
                    <li
                      key={sort?._id}
                      className="px-4 py-2 capitalize hover:bg-indigo-500 hover:text-white cursor-pointer"
                      onClick={() => {
                        setCategory(sort?.title);
                        setIsOpenSort('');
                      }}>
                      {sort?.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Brand product */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md py-2 px-4">
                <legend className="font-medium uppercase">Brand</legend>
                <button
                  type="button"
                  onClick={() =>
                    setIsOpenSort((prev) => (prev === 'brand' ? '' : 'brand'))
                  }
                  className="w-full flex justify-between text-left">
                  <span className="capitalize">
                    {brands?.find((i) => i?.title === brand)?.title || 'Select'}
                  </span>
                  {isOpenSort === 'brand' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </fieldset>

              {isOpenSort === 'brand' && (
                <ul className="w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                  {brands?.map((sort) => (
                    <li
                      key={sort?._id}
                      className="px-4 py-2 capitalize hover:bg-indigo-500 hover:text-white cursor-pointer"
                      onClick={() => {
                        setBrand(sort?.title);
                        setIsOpenSort('');
                      }}>
                      {sort?.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* <!-- Price Range --> */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md py-2 px-4">
                <legend className="font-medium uppercase">Price</legend>
                <input
                  type="range"
                  className="w-full"
                  min={0}
                  max={100000}
                  step="10"
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
                <div className="flex gap-5 justify-between text-sm">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value))}
                  />
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                </div>
              </fieldset>
            </div>

            {/* <!-- Rating Filter --> */}
            <div className="flex flex-col w-full text-sm relative">
              <fieldset className="border border-gray-300 rounded-md py-2 px-4">
                <legend className="font-medium uppercase">Rating</legend>
                {[3, 4, 5].map((it) => (
                  <label
                    htmlFor={it}
                    key={it}
                    className="flex items-center mb-2 gap-2 capitalize text-sm cursor-pointer">
                    <input
                      onChange={(e) => setRating(e.target.checked ? it : 0)}
                      value={rating}
                      checked={rating === it}
                      id={it}
                      name={it}
                      type="radio"
                      className="form-checkbox text-blue-600"
                    />
                    <div className="flex space-x-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            fill={i < it ? 'oklch(85.2% 0.199 91.936)' : '#fff'}
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                    </div>
                    ({it})
                  </label>
                ))}
              </fieldset>
            </div>

            {/* <!-- Clear Filters --> */}
            <div className="flex justify-between gap-4 h-fit sticky -bottom-4 p-2 bg-white">
              <button
                onClick={() => setMobileView(false)}
                className="btn-primary !text-sm !rounded-full flex-1">
                Apply
              </button>
              <button
                className="btn-primary !text-sm !rounded-full !bg-rose-600 flex-1"
                onClick={() => {
                  setLimit(10);
                  setCategory('');
                  setBrand('');
                  setMaxPrice(100000);
                  setMinPrice(0);
                  setRating(0);
                  setSearch('');
                  setPage(1);
                  setMobileView(false);
                }}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Pagination */}
          <div className="flex gap-4 justify-between items-center card !px-2">
            <p className="text-sm pl-2">
              <span className="max-sm:hidden">Showing</span>{' '}
              {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, data?.totalDocs || 0)} of{' '}
              {data?.totalDocs}
            </p>
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={() => data?.hasPrevPage && setPage((prev) => prev - 1)}
                className="flex items-center justify-center hover:bg-gray-100 rounded-full p-2">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="w-5 text-center">{page}</span>
              <button
                className="flex items-center justify-center hover:bg-gray-100 rounded-full p-2"
                onClick={() =>
                  data?.hasNextPage && setPage((prev) => prev + 1)
                }>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <button
              className="flex lg:hidden items-center justify-center py-2 px-3 hover:bg-gray-200 rounded-full gap-2"
              onClick={() => setMobileView(true)}>
              <Settings className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {(loading || !data?.totalDocs) && (
            <div className={`grid md:grid-cols-3 grid-cols-2 gap-2 px-2`}>
              {Array.from({ length: 10 }, (v, i) => (
                <Skeleton key={i} height={210} />
              ))}
            </div>
          )}

          {/* <!-- Products Grid --> */}
          <div className={`grid md:grid-cols-3 grid-cols-2 gap-2 sm:gap-4`}>
            {/* <!-- Product Card --> */}
            {data?.docs?.length &&
              data?.docs?.map((item, index) => (
                <ProductItem
                  key={item?._id}
                  {...item}
                  delay={index + 1 + '00ms'}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
