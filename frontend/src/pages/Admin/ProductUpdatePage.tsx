import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks';
import { DataState, ProductForm } from '../../components';
import { useEffect } from 'react';
import type { Product } from '../../types';

const ProductUpdatePage = () => {
  const { id } = useParams();
  const { callApi, data, loading, error } = useApi<Product>();

  useEffect(() => {
    callApi(`/product/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <DataState data={[data]} error={error} loading={loading}>
      {(productData) => <ProductForm data={productData[0]} />}
    </DataState>
  );
};

export default ProductUpdatePage;
