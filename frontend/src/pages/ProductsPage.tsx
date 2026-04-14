/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, Settings, Star, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useApi } from '../hooks';
import { ProductItem } from '../components';
import type { Pagination, Product } from '../types';
import { brands, categories } from '../utils';

type QueryProps = {
  page: number;
  limit: number;
  search: string;
  category: string;
  brand: string;
  maxPrice: number;
  minPrice: number;
  rating: number;
  sort: string;
};

const ProductListing = () => {
  const [query, setQuery] = useState<QueryProps>({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    brand: '',
    maxPrice: 100000,
    minPrice: 0,
    rating: 0,
    sort: '',
  });
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const { callApi, data, loading } = useApi<Pagination<Product>>();

  useEffect(() => {
    callApi(`/product`, 'get', {
      ...query,
      title: query.search,
      sort: query.sort.split('-')[0],
      order: query.sort.split('-')[1],
    });
  }, [query]);

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <section className='w-full'>
      {/* Top Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 mb-6 bg-white shadow-sm rounded-xl p-3'>
        {/* Left - Result Count */}
        <p className='text-sm text-gray-600'>
          Showing <span className='font-semibold'>1-10</span> of{' '}
          <span className='font-semibold'>{data?.totalDocs || 0}</span>
        </p>

        {/* Right - Actions */}
        <button
          onClick={() => setIsOpenFilter(!isOpenFilter)}
          className='flex items-center gap-2 rounded-full shadow py-2 px-4 hover:bg-gray-100'>
          <Settings className='w-4 h-4' />
          <span className='text-sm font-semibold'>Filter</span>
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='h-[260px] bg-gray-200 animate-pulse rounded-xl' />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
          {data?.docs?.map((item, index) => (
            <ProductItem key={item._id} {...item} delay={index * 0.1} />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <div className='flex items-center gap-2 h-10 rounded-full p-2 bg-white shadow w-fit mx-auto mt-8'>
        <button
          disabled={data?.page === 1}
          onClick={() => handlePageChange(Number(data?.page) - 1 || 1)}
          className='p-2 hover:bg-gray-100 rounded-full'>
          <ArrowLeft className='w-4 h-4' />
        </button>

        <span className='text-sm font-semibold'>Page {data?.limit}</span>

        <button
          disabled={(data && data.page === data.totalPages) || false}
          onClick={() => handlePageChange(Number(data?.page) + 1 || data?.totalPages || 1)}
          className='p-2 hover:bg-gray-100 rounded-full'>
          <ArrowRight className='w-4 h-4' />
        </button>
      </div>

      {/* Filter Products */}
      {isOpenFilter && (
        <ProductFilterModal
          onClose={() => setIsOpenFilter(false)}
          filters={query}
          open={isOpenFilter}
          setFilters={setQuery}
        />
      )}
    </section>
  );
};

export default ProductListing;

type ProductFilterModalProp = {
  open: boolean;
  onClose: () => void;
  filters: QueryProps;
  setFilters: React.Dispatch<React.SetStateAction<QueryProps>>;
};

const ProductFilterModal = ({ open, onClose, filters, setFilters }: ProductFilterModalProp) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search.length < 2) return;
    const delay = setTimeout(() => {
      setFilters((prev: QueryProps) => ({
        ...prev,
        search,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center'>
          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className='w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Filters</h2>
              <X className='cursor-pointer' onClick={onClose} />
            </div>

            {/* Search */}
            <div className='mb-4'>
              <div className='flex items-center border rounded-lg px-3 py-2'>
                <Search className='w-4 h-4 text-gray-400' />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search products...'
                  className='w-full outline-none px-2 text-sm'
                />
              </div>
            </div>

            {/* Category */}
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>Category</p>
              <div className='flex flex-wrap gap-2'>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, category: c })}
                    className={`px-3 py-1 rounded-full text-sm border ${filters.category === c ? 'bg-indigo-600 text-white' : ''}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>Brand</p>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 text-sm'>
                <option value=''>All</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>Price Range</p>
              <input
                type='range'
                min={0}
                max={100000}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: +e.target.value })}
                className='w-full'
              />
              <div className='flex justify-between text-sm'>
                <span>₹{filters.minPrice}</span>
                <span>₹{filters.maxPrice}</span>
              </div>
            </div>

            {/* Sort */}
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>Sort By</p>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 text-sm'>
                <option value='title-asc'>Title A-Z</option>
                <option value='price-asc'>Price Low → High</option>
                <option value='price-desc'>Price High → Low</option>
              </select>
            </div>

            {/* Rating */}
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>Rating</p>
              {[3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters({ ...filters, rating: r })}
                  className='flex items-center gap-2 mb-2'>
                  <div className='flex'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill='currentColor'
                        />
                      ))}
                  </div>
                  <span>{r}+</span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className='flex gap-3 mt-4'>
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    category: '',
                    brand: '',
                    minPrice: 0,
                    maxPrice: 100000,
                    rating: 0,
                    sort: 'title-asc',
                    page: 1,
                    limit: 10,
                  })
                }
                className='flex-1 bg-gray-200 py-2 rounded-lg'>
                Reset
              </button>
              <button onClick={onClose} className='flex-1 bg-indigo-600 text-white py-2 rounded-lg'>
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
