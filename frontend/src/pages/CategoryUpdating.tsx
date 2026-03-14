import { useLocation } from 'react-router-dom';
import { CategoryForm } from '../components';
import useFetch from '../hooks/useFetch';
import { Loading, NotFound } from '../components/ui';

const CategoryUpdate = () => {
  const path = useLocation().pathname.split('/');

  const { data, loading, error } = useFetch<CategoryType | BrandType>(`/${path[1]}/${path[2]}`);

  if (loading) return <Loading />;

  if (error) return <NotFound title={JSON.stringify(error)} />;

  return <CategoryForm item={data} />;
};

export default CategoryUpdate;
