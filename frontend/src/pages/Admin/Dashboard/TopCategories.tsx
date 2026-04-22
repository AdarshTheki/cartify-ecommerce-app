import { Counter, Loading } from '../../../components';
import { useFetch } from '../../../hooks';
import { api, errorHandler } from '../../../services';
import { downloadCategoriesAsCSV } from '../../../utils';
import { Download, Loader } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

type items = {
  _id: string;
  count: number;
};

type TopCategoriesProps = {
  categories: items[];
  brands: items[];
};

const TopCategories = () => {
  const [categoryLoading, setCategoryLoading] = useState(false);

  const { data, loading } = useFetch<TopCategoriesProps>('/dashboard/top-categories');

  const handleDownloadCSV = async (name: string) => {
    try {
      setCategoryLoading(true);
      const res = await api.get(`/dashboard/download/${name}`);
      if (res.data) {
        downloadCategoriesAsCSV(res.data.data, name);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setCategoryLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='grid gap-5'>
      <div className=''>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Top Categories</h2>
          <button
            onClick={() => handleDownloadCSV('category')}
            className='border text-sm flex items-center gap-2 border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 duration-300'>
            {categoryLoading ? <Loader size={16} /> : <Download size={16} />} Export
          </button>
        </div>
        <div className='py-4'>
          {data
            ? data?.categories.map((product) => (
                <div key={product._id} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <img src={'/placeholder.jpg'} />
                    </div>
                    <NavLink to={`/category?q=${product._id}`} className='font-medium capitalize'>
                      {product._id || 'Wireless Earbuds'}
                    </NavLink>
                  </div>
                  <p className='text-right text-green-500'>
                    +<Counter target={product.count || 12} /> count
                  </p>
                </div>
              ))
            : null}
        </div>
      </div>

      <div className=''>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Top Brands</h2>
          <button
            onClick={() => handleDownloadCSV('brand')}
            className='border text-sm flex items-center gap-2 border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 duration-300'>
            {categoryLoading ? <Loader size={16} /> : <Download size={16} />} Export
          </button>
        </div>
        <div className='py-4'>
          {data
            ? data?.brands.map((product) => (
                <div key={product._id} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <img alt='image' src={'/placeholder.jpg'} />
                    </div>
                    <NavLink to={`/brand?q=${product._id}`} className='font-medium'>
                      {product._id || 'Wireless Earbuds'}
                    </NavLink>
                  </div>
                  <p className='text-right text-green-500'>
                    +<Counter target={product.count || 12} /> count
                  </p>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
