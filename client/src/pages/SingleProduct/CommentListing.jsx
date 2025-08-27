import { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2Icon } from 'lucide-react';

import { errorHandler, axios } from '../../config';
import CommentReply from './CommentReply';
import useApi from '../../hooks/useApi';
import { Loading } from '../../utils';

const COmmentListing = () => {
  const { id } = useParams();
  const [createText, setCreateText] = useState('');
  const userId = useSelector((state) => state?.auth?.user?._id);

  const { data, setData, loading, callApi } = useApi();

  useEffect(() => {
    callApi(`/comment/${id}`, {}, 'get');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const createComment = async (e) => {
    e.preventDefault();
    try {
      if (!createText.trim()) return toast.error('Please fill the text input');
      const res = await axios.post(`/comment`, {
        productId: id,
        text: createText,
      });
      if (res.data) {
        setData((prev) => [res.data?.data, ...prev]);
        setCreateText('');
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  /*
  const updateComment = async (commentId, text) => {
    try {
      if (!text.trim()) return toast.error('Please fill the text input');
      const res = await axios.patch(`/comment/${commentId}`, { text });
      if (res.data.data) {
        setData((prev) =>
          prev.map((i) => (i._id === commentId ? { ...i, text } : i))
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };
*/
  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`/comment/${commentId}`);
      if (res.data.data) {
        setData((prev) => prev.filter((i) => i._id !== commentId));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const replyReportComment = async (commentId, text, type) => {
    try {
      let res;
      if (type === 'replies') {
        res = await axios.post(`/comment/${commentId}/reply`, { text });
      } else {
        res = await axios.post(`/comment/${commentId}/report`, {
          reason: text,
        });
      }
      if (res.data.data) {
        setData((prev) =>
          prev.map((c) => (c._id === commentId ? res.data.data : c))
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-gray-800 uppercase mb-5">
        Comment
      </h2>

      <div className="grid gap-4">
        {/* Review Form */}
        <form onSubmit={createComment} className="w-full card space-y-2">
          <label htmlFor="public_comment" className="font-medium">
            Public comment
          </label>
          <textarea
            rows={2}
            id="public_comment"
            className="w-full outline-none border border-indigo-300 rounded-lg mt-1 py-2 px-4"
            placeholder="Write your review..."
            value={createText}
            onChange={(e) => setCreateText(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <button
              disabled={!createText.trim()}
              className="btn-primary !text-xs disabled:opacity-70">
              Post Comment
            </button>
            {createText.trim() && (
              <button
                onClick={() => setCreateText('')}
                type="button"
                className="btn-secondary !text-xs disabled:opacity-70">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* comment Listing */}
        {data &&
          data?.map((item) => (
            <div key={item?._id} className="w-full card space-y-4">
              <div className="flex gap-5 max-sm:flex-col relative">
                <div className="flex gap-4 min-w-[200px] relative items-center">
                  <img
                    src={
                      item?.createdBy?.avatar ||
                      'https://avatar.iran.liara.run/public'
                    }
                    alt="Customer"
                    className="w-10 h-10 rounded-full object-cover transition-opacity duration-300 opacity-100"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold">{item?.createdBy?.fullName}</p>
                    <p className="text-gray-500 text-xs">
                      {format(new Date(item?.createdAt), 'dd MMM yyyy, h:mm a')}
                    </p>
                  </div>
                </div>
                <p>{item?.text}</p>
                {/* Delete Comment */}
                {item?.createdBy?._id === userId && (
                  <button
                    onClick={() => deleteComment(item?._id)}
                    className="absolute bg-white top-0 right-0 cursor-pointer svg-btn p-2 text-red-600">
                    <Trash2Icon />
                  </button>
                )}
              </div>

              {/* Reply or report display */}
              <CommentReply onReplyComment={replyReportComment} item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default COmmentListing;
