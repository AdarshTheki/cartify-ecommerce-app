import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Loading, NotFound } from '../ui';
import { UserForm } from '../components';
import { useTitle } from '../hooks';

const CustomerUpdate = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch<UserType>(`/user/admin/${id}`);

  useTitle(data ? 'cartify: customer create' : 'cartify: customer update');

  if (loading) return <Loading />;

  if (error) return <NotFound title={error} />;

  return (
    <div>
      <UserForm userData={data ?? undefined} />
    </div>
  );
};

export default CustomerUpdate;
