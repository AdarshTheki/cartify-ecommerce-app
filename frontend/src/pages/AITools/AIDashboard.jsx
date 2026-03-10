import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { Loading } from '../../utils';
import DashboardCard from './DashboardCard';
import { axios, errorHandler } from '../../config';

const AIDashboard = () => {
  const [selectedArticle, setSelectedArticle] = useState('');
  const { callApi, data, loading, setData } = useApi();

  useEffect(() => {
    callApi('/openai/generate-text', {}, 'get');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletePost = async (id) => {
    try {
      const res = await axios.delete(`/openai/post/${id}`);
      if (res.data) {
        setData((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="mx-auto container p-4 space-y-5">
      <div className="card flex items-center sm:w-84 !px-6">
        <div className="text-lg font-medium space-y-2 w-full">
          <p className="text-xl font-medium">Total Creations</p>
          <p>{data?.length}</p>
        </div>
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      {/* Recent Creations */}
      <p>Recent Creations</p>

      <div className="flex flex-col gap-5">
        {!loading ? (
          data?.map((item) => (
            <DashboardCard
              key={item._id}
              isActive={item._id === selectedArticle}
              onActive={() =>
                setSelectedArticle((prev) =>
                  prev === item._id ? '' : item._id
                )
              }
              onDelete={() => handleDeletePost(item._id)}
              item={item}
            />
          ))
        ) : (
          <Loading className="!h-[300px]" />
        )}
      </div>
    </div>
  );
};

export default AIDashboard;
