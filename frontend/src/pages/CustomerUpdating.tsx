import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Loading, NotFound } from '../components/ui';
import { UserForm } from '../components';
import { useTitle } from '../hooks';

const CustomerUpdate = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch<UserType>(`/user/admin/${id}`);

  useTitle(data ? 'cartify: customer create' : 'cartify: customer update');

  if (loading) return <Loading />;

  if (error) return <NotFound title={error} />;

  return <UserForm userData={data} />;
};

export default CustomerUpdate;
