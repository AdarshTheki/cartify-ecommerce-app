import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowDownZA, ArrowUpAZ, Plus, SquarePen, Trash2 } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useApi } from '../../hooks';
import { DeleteModal, Input, LazyImage, Select, DataTable } from '../../components';
import type { Brand, TableColumn, Pagination, TableQuery } from '../../types';
import { useAppSelector } from '../../store/store';
import { BrandDelete } from '../../services/brandService';
import { errorHandler } from '../../services';

const BrandsPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [query, setQuery] = useState<TableQuery>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'asc',
    select: 'title,thumbnail,createdAt,updatedAt,createdBy,status',
  });
  const [search, setSearch] = useState('');
  const { callApi, setData, data, error, loading } = useApi<Pagination<Brand>>();

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
    callApi(`/brand`, 'get', {
      ...query,
      title: query.search,
      sort: query.sortBy,
      order: query.sortOrder,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const columns: TableColumn<Brand>[] = [
    {
      header: '#',
      render: (_, index) => (query.page - 1) * query.limit + (index + 1),
    },
    {
      header: 'Brands',
      render: (category) => (
        <div className='flex items-center gap-2 min-w-[180px]'>
          <LazyImage
            src={category.thumbnail}
            className='w-12 h-12 rounded-lg object-cover border bg-gray-300'
          />
          <p>{category.title}</p>
        </div>
      ),
    },
    {
      header: 'Creation',
      render: (category) => format(new Date(category.createdAt), 'p, PPP'),
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    ...(user?.role === 'admin'
      ? [
          {
            header: 'Action',
            className: 'text-right',
            render: (category: Brand) => (
              <div className='flex items-center justify-start gap-2'>
                <SquarePen
                  onClick={() => navigate(`/admin/brands/${category._id}`)}
                  className='svg-btn p-2 text-blue-600 cursor-pointer'
                />
                <Trash2
                  onClick={() => setSelectedId(category._id)}
                  className='svg-btn p-2 text-red-600 cursor-pointer'
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteBand = async () => {
    try {
      if (!selectedId) return;
      const res = await BrandDelete(selectedId);
      if (res.data) {
        setData((prev) => prev && { ...prev, docs: prev.docs.filter((p) => p._id !== selectedId) });
      }
    } catch (error) {
      errorHandler(error);
    }
  };

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

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Brand Listing</h2>
        <NavLink
          to={`/admin/brands/create`}
          className='flex gap-2 items-center py-2 px-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700'>
          <Plus /> Add Brand
        </NavLink>
      </div>
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
          list={['title', 'createdAt', 'updatedAt', 'status']}
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
        page={query.page}
        limit={query.limit}
        onPageChange={handlePageChange}
        onSort={handleSort}
      />

      {/* Delete Product Model */}
      <DeleteModal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        onConfirm={handleDeleteBand}
      />
    </div>
  );
};

export default BrandsPage;
