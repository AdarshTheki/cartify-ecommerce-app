import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowDownZA, ArrowUpAZ, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DeleteModal, Input, LazyImage, Select, DataTable } from '../../components';
import { useApi } from '../../hooks';
import type { TableColumn, Pagination, Product, TableQuery } from '../../types';
import { useAppSelector } from '../../store/store';
import { deleteProduct } from '../../services/productService';
import { errorHandler } from '../../services';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [query, setQuery] = useState<TableQuery>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'asc',
    select: 'title,thumbnail,createdAt,category,status,brand,stock,price,discount',
  });
  const [search, setSearch] = useState('');
  const { callApi, setData, data, error, loading } = useApi<Pagination<Product>>();

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
    callApi(`/product`, 'get', {
      ...query,
      title: query.search,
      sort: query.sortBy,
      order: query.sortOrder,
    });
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

  const columns: TableColumn<Product>[] = [
    {
      header: '#',
      render: (_, index) => (query.page - 1) * query.limit + (index + 1),
    },
    {
      header: 'Products',
      render: (product) => (
        <div className='flex items-center gap-2 min-w-[180px]'>
          <LazyImage
            src={product.thumbnail}
            className='w-12 h-12 rounded-lg object-cover border bg-gray-300'
          />
          <p>{product.title}</p>
        </div>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
    },
    {
      header: 'Price $',
      accessor: 'price',
    },
    {
      header: 'Discount %',
      accessor: 'discount',
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
            render: (product: Product) => (
              <div className='flex items-center justify-start gap-2'>
                <SquarePen
                  onClick={() => navigate(`/admin/products/${product._id}`)}
                  className='svg-btn p-2 text-blue-600 cursor-pointer'
                />
                <Trash2
                  onClick={() => setSelectedId(product._id)}
                  className='svg-btn p-2 text-red-600 cursor-pointer'
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteProduct = async () => {
    try {
      if (!selectedId) return;
      const res = await deleteProduct(selectedId);
      if (res.data) {
        setData((prev) => prev && { ...prev, docs: prev.docs.filter((p) => p._id !== selectedId) });
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Product Listing</h2>
        <NavLink
          to={`/admin/products/create`}
          className='flex gap-2 items-center py-2 px-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700'>
          <Plus /> Add Product
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
          list={['title', 'discount', 'stock', 'price', 'updatedAt', 'createdAt']}
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
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}
