import { Download, Loader } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useFetch } from '../../../hooks';
import { Loading, Counter } from '../../../components';
import { downloadProductsAsCSV } from '../../../utils';
import { api, errorHandler } from '../../../services';

interface TopProductsProp {
  thumbnail: string;
  category: string;
  brand: string;
  title: string;
  totalQuantity: number;
  totalRevenue: number;
  unitPrice: number;
  _id: string;
}

function TopProducts() {
  const { data, loading } = useFetch<TopProductsProp[]>('/dashboard/top-products');

  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/dashboard/download/product');
      if (res.data) {
        downloadProductsAsCSV(res.data.data);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Top Products</h2>
        <button
          onClick={handleDownloadCSV}
          className='border text-sm flex items-center gap-2 border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 duration-300'>
          {isLoading ? <Loader size={16} /> : <Download size={16} />} Export
        </button>
      </div>
      <div className='py-6'>
        <div className='space-y-4'>
          {data
            ? data?.map((product) => (
                <div key={product._id} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <img alt='image' src={product.thumbnail || '/placeholder.jpg'} />
                    </div>
                    <div>
                      <NavLink
                        to={`/product/${product._id}`}
                        className='font-medium max-sm:max-w-[180px] line-clamp-1'>
                        {product.title || 'Wireless Earbuds'}
                      </NavLink>
                      <p className='text-sm text-gray-500 max-sm:max-w-[150px] line-clamp-1'>
                        {product.category}, {product.brand}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>
                      $<Counter target={product.totalRevenue || 239} />
                      <span className='text-xs text-gray-400 px-2'>
                        {product.unitPrice.toFixed(0)}
                      </span>
                    </p>
                    <p className='text-sm text-green-500'>
                      +<Counter target={product.totalQuantity || 12} /> sold
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default TopProducts;
