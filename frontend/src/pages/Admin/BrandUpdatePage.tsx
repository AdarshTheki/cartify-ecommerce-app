import { useParams } from 'react-router-dom';
import { BrandForm, DataState } from '../../components';
import useFetch from '../../hooks/useFetch';

const BrandUpdatePage = () => {
  const { id } = useParams();

  const { data, loading, error } = useFetch<BrandType>(`/brand/${id}`);

  return (
    <DataState data={[data]} loading={loading} error={error}>
      {(brands) => <BrandForm item={brands[0]} />}
    </DataState>
  );
};

export default BrandUpdatePage;
