import { useEffect, useState } from 'react';
import { ArrowDownZA, ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowUpAZ } from 'lucide-react';
import type { Image, Pagination } from '../../types';
import { Input, Selection } from '../../components';
import { useApi } from '../../hooks';
import ImageModal from './ImageModal';
import ImageCard from './ImageCard';

// Usage Example inside Gallery
export default function ImageListing() {
  const { callApi, data, loading } = useApi<Pagination<Image>>();
  const [selected, setSelected] = useState<Image | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({
    page: 1,
    limit: 30,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

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
    callApi('/image', 'get', query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (loading)
    return (
      <div className='grid sm:grid-cols-4 sm:gap-5 grid-cols-2 gap-3'>
        {Array.from({ length: query.limit }, (_, i) => (
          <div key={i} className='w-full h-48 bg-gray-200 animate-pulse rounded-2xl' />
        ))}
      </div>
    );

  return (
    <div className='w-full'>
      {/* Image Search Filter & Sort */}
      <div className='flex gap-2 max-w-sm mb-5'>
        <Input
          value={search}
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
          placeholder='Search...'
          className='!border-gray-500'
        />
        <Selection
          selected={query.sortBy as string}
          options={[
            { name: 'Title', value: 'title' },
            { name: 'Size', value: 'size' },
            { name: 'Format', value: 'format' },
            { name: 'Updated At', value: 'updatedAt' },
            { name: 'Created At', value: 'createdAt' },
          ]}
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

      {/* Image Listing */}

      <div className='grid sm:grid-cols-4 lg:grid-cols-5 grid-cols-2 gap-2'>
        {data?.docs?.map((img) => (
          <ImageCard image={img} onSelectedClick={setSelected} key={img._id} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className='flex justify-between items-center mt-4'>
        <p className='text-sm'>
          Page {query.page} of {data?.totalDocs}
        </p>

        <div className='flex gap-2'>
          <button
            disabled={query.page === 1}
            onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
            className='svg-btn'>
            <ArrowLeftCircleIcon />
          </button>

          <button
            disabled={query.page * query.limit >= Number(data?.totalDocs)}
            onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
            className='svg-btn'>
            <ArrowRightCircleIcon />
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {selected?._id && <ImageModal image={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
