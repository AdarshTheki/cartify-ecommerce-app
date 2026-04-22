import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import type { TableData } from '../../types';
import type React from 'react';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-center text-center min-h-[60vh]'>{children}</div>
  );
}

const DataTable = <T,>({
  data,
  columns,
  totalDocs,
  limit,
  page,
  onPageChange,
  onSort,
  loading,
  error,
}: TableData<T>) => {
  const totalPages = Math.ceil(totalDocs / limit);

  if (loading)
    return (
      <Container>
        <span>Loading...</span>
      </Container>
    );

  if (error) {
    return (
      <Container>
        <span className='text-red-600'>Error: {error || 'Something went wrong!'}</span>
      </Container>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container>
        <span>No Data Available</span>
      </Container>
    );
  }

  return (
    <div className='w-full'>
      {/* TABLE */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-300 text-slate-700'>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className='py-3 px-4 text-left cursor-pointer'
                  onClick={() => col.sortable && col.sortKey && onSort(col.sortKey)}>
                  {col.header} {col.sortable && '↕'}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className='border-b text-sm border-gray-100 hover:bg-gray-50'>
                {columns.map((col, j) => (
                  <td key={j} className='py-3 px-4 text-left'>
                    {col.render
                      ? col.render(row, i)
                      : (row[col.accessor as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className='flex justify-between items-center mt-4'>
        <p className='text-sm'>
          Page {page} of {totalDocs}
        </p>

        <div className='flex gap-2'>
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className='svg-btn'>
            <ArrowLeftCircleIcon />
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className='svg-btn'>
            <ArrowRightCircleIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
