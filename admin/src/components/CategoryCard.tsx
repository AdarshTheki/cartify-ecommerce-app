import { axiosInstance, errorHandler } from '@/lib/utils';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteModal } from './ui';
import { SquarePen, Trash2 } from 'lucide-react';

export default function CategoryList({ items }: { items: CategoryType[] }) {
  const [categories, setCategories] = useState<CategoryType[]>(
    () => items || []
  );
  const { pathname } = useLocation();
  const path = pathname.split('/').join('');
  const [showModel, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/${path}/${id}`);
      if (res.data) {
        setCategories((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  const handleStatusChange = async (id: string, status: ActiveOrInActive) => {
    try {
      const res = await axiosInstance.patch(`/${path}/${id}`, { status });
      if (res.data) {
        setCategories((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p))
        );
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  return (
    <div className="w-full" style={{ overflow: 'auto' }}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300 text-slate-700">
            <th className="text-left sm:py-3 sm:px-4">#</th>
            <th className="text-left py-3 px-4 min-w-[180px]">Category</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={index}
              className="border-b text-sm border-gray-100 hover:bg-gray-50 capitalize">
              <td className="sm:py-3 sm:px-4">{index + 1}</td>
              <td className="py-3 px-4 flex items-center gap-2">
                <img
                  src={category.thumbnail || '/placeholder.jpg'}
                  alt={'category_' + index}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
                <span className="text-nowrap line-clamp-1">
                  {category.title}
                </span>
              </td>
              <td className="py-3 px-4 text-nowrap">
                {format(new Date(category.updatedAt), 'MMM d, yyyy')}
              </td>
              <td className="px-4">
                <select
                  className="border-b border-gray-600 p-1 cursor-pointer"
                  name="status"
                  id="status"
                  value={category.status}
                  onChange={(e) =>
                    handleStatusChange(
                      category._id,
                      e.target.value as ActiveOrInActive
                    )
                  }>
                  <option value="active">Active</option>
                  <option value="inactive">In-Active</option>
                </select>
              </td>
              <td className="flex items-center pb-5 justify-end">
                <DeleteModal
                  isOpen={showModel}
                  onClose={() => setShowModal(false)}
                  onConfirm={() => handleDeleteCategory(category._id)}
                />
                <SquarePen
                  onClick={() => navigate(`/${path}/${category._id}`)}
                  className="svg-btn p-2 text-blue-600 !m-0 cursor-pointer"
                />
                <Trash2
                  onClick={() => setShowModal(true)}
                  className="svg-btn p-2 text-red-600 !m-0 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
