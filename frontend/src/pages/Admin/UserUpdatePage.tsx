import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { DataState, UserForm } from '../../components';
import { useTitle } from '../../hooks';

const UserUpdatePage = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch<UserType>(`/user/admin/${id}`);

  useTitle(data ? 'cartify: customer create' : 'cartify: customer update');

  return (
    <DataState data={[data]} loading={loading} error={error}>
      {(categories) => <UserForm userData={categories[0]} />}
    </DataState>
  );
};

export default UserUpdatePage;
