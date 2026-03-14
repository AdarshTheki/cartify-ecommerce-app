import { useState } from 'react';
import { useEffect } from 'react';
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { useApi } from '../../hooks';
import { Loading, Select } from '../../components/ui';
import GalleryCard from './GalleryCard';
import { socialFormats } from '../../utils';

const sorts = [
  'created_at',
  'public_id',
  'updated_at',
  'uploaded_at',
  'bytes',
  'width',
  'height',
  'format',
  'resource_type',
  'type',
  'context',
  'tags',
  'filename',
  'access_mode',
];

const GalleryImage = () => {
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [expression, setExpression] = useState('resource_type:image');
  const [selectedFormat, setSelectedFormat] = useState('Instagram Square (1:1)');
  const { data, loading, callApi, setData } = useApi<CloudinaryFileType[]>();

  useEffect(() => {
    callApi(`/cloudinary?expression=${expression}&sort=${sort}&order=${order}&limit=${limit}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, sort, order, expression]);

  return (
    <div>
      <h2 className='text-xl font-medium'>All Images</h2>
      <div className='py-5 flex'>
        <Select
          list={['resource_type:image', 'resource_type:video']}
          onSelected={setExpression}
          selected={expression}
          label={'Asset Resource Types'}
        />
        <Select
          label={'Folder Names'}
          list={['folder:cartify', 'folder:cartify-demo', 'folder:gallery']}
          onSelected={setExpression}
          selected={expression}
        />
        <Select label={'Advanced Sorts'} list={sorts} onSelected={setSort} selected={sort} />
        <Select
          label={'Social Formate Sizes'}
          list={Object.keys(socialFormats)}
          onSelected={setSelectedFormat}
          selected={selectedFormat}
        />
        <Select
          label={'Pages'}
          list={[10, 20, 30].map((i) => i.toString())}
          selected={limit.toString()}
          onSelected={(v: string) => setLimit(parseInt(v))}
        />
        <button
          onClick={() => setOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
          className='px-4 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none'>
          {order === 'asc' ? (
            <ArrowDownAZ strokeWidth={1} size={20} />
          ) : (
            <ArrowUpZA strokeWidth={1} size={20} />
          )}
        </button>
      </div>

      {!!loading && <Loading />}

      <div className='sm:gap-4 gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5'>
        {data &&
          data.length > 0 &&
          data.map((img, index) => {
            const format = socialFormats[selectedFormat as keyof typeof socialFormats];
            const secureUrl = img?.secure_url || '';
            const path = secureUrl?.split('/upload').length
              ? secureUrl
                  .split('/upload')
                  .join(
                    `/upload/w_${format.width},h_${format.height},ar_${format.aspectRatio},c_fill`,
                  )
              : secureUrl;

            return (
              <GalleryCard
                key={index}
                {...img}
                secure_url={path}
                folder={img.folder || ''}
                onDelete={() =>
                  setData((prev) => (prev ? prev.filter((i) => i.public_id !== img.public_id) : []))
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default GalleryImage;
