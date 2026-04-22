import { useEffect } from 'react';
import { AddressForm, DataState } from '../components';
import { useApi } from '../hooks';
import { useParams } from 'react-router-dom';
import type { Address } from '../types';

const AddressUpdate = () => {
  const { id } = useParams();
  const { callApi, data, loading, error } = useApi<Address>();

  useEffect(() => {
    callApi(`/address/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <DataState data={[data]} error={error} loading={loading}>
      {(addresses) => addresses.map((address) => <AddressForm form={address} />)}
    </DataState>
  );
};

export default AddressUpdate;
