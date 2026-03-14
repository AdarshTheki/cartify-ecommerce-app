type DataStateProps<T> = {
  loading: boolean;
  error: string | null;
  data: T[] | null;
  children: (data: T[]) => React.ReactNode;
};

function DataState<T>({ loading, error, data, children }: DataStateProps<T>) {
  if (loading) {
    return <div className='p-6 text-center'>Loading...</div>;
  }

  if (error) {
    return (
      <div className='p-6 text-center text-red-600'>Error: {error || 'Something went wrong!'}</div>
    );
  }

  if (!data || data.length === 0) {
    return <div className='p-6 text-center'>No Data Available</div>;
  }

  return <>{children(data)}</>;
}

export default DataState;
