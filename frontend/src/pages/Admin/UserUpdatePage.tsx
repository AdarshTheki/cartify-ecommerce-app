import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { DataState, UserForm } from '../../components';
import { useTitle } from '../../hooks';
import type { User } from '../../types';

const UserUpdatePage = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch<User>(`/user/admin/${id}`);

  useTitle(data ? 'cartify: customer create' : 'cartify: customer update');

  return (
    <DataState data={[data]} loading={loading} error={error}>
      {(user) => <UserForm userData={user[0]} />}
    </DataState>
  );
};

export default UserUpdatePage;
