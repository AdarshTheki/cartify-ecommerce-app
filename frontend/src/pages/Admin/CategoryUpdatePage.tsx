import { useParams } from 'react-router-dom';
import { CategoryForm, DataState } from '../../components';
import useFetch from '../../hooks/useFetch';
import type { Category } from '../../types';

const CategoryUpdatePage = () => {
  const { id } = useParams();

  const { data, loading, error } = useFetch<Category>(`/category/${id}`);

  return (
    <DataState data={[data]} loading={loading} error={error}>
      {(categories) => <CategoryForm item={categories[0]} />}
    </DataState>
  );
};

export default CategoryUpdatePage;
