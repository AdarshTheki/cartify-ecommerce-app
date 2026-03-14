import { DataState, ProductForm } from '../components';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks';
import { useEffect } from 'react';

const ProductUpdate = () => {
  const { id } = useParams();
  const { callApi, data, loading, error } = useApi<ProductType>();

  useEffect(() => {
    callApi(`/product/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <DataState data={data} error={error} loading={loading}>
      <ProductForm data={data} />
    </DataState>
  );
};

export default ProductUpdate;
