import { Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApi } from '../hooks';
import { useEffect } from 'react';
import { deleteAddress } from '../services/addressService';
import { errorHandler } from '../services';
import { AddressItem, DataState } from '../components';
import type { Address } from '../types';

const AddressListing = () => {
  const { callApi, setData, data, loading, error } = useApi<Address[]>();

  useEffect(() => {
    callApi('/address');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await deleteAddress(id);
      if (res.data) {
        setData((prev) => prev && prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  return (
    <div className='mx-auto max-w-xl py-4'>
      <NavLink
        to={'/shipping-address/create'}
        className='border border-gray-300 shadow p-4 rounded-lg flex gap-5 mb-5'>
        <Plus /> <span>New Address</span>
      </NavLink>

      <DataState data={data} loading={loading} error={error}>
        {(addresses) =>
          addresses.map((address) => (
            <AddressItem
              key={address._id}
              {...address}
              onDelete={() => handleDeleteAddress(address._id || '')}
            />
          ))
        }
      </DataState>
    </div>
  );
};

export default AddressListing;
