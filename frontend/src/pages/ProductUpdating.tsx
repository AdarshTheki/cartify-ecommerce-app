import { ProductForm } from '../components';
import useFetch from '../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { Loading, NotFound } from '../ui';

const ProductUpdate = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch<ProductType>(`/product/${id}`);

  if (loading) return <Loading />;

  if (error) return <NotFound title={JSON.stringify(error)} />;

  return <ProductForm data={data ?? undefined} />;
};

export default ProductUpdate;
