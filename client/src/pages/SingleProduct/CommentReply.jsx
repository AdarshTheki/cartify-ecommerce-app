import React, { useState } from 'react';
import { format } from 'date-fns';
import CommentLike from './CommentLike';
import { MessageSquare, MessageSquareDiff } from 'lucide-react';

const CommentReply = ({ item, onReplyComment }) => {
  const [text, setText] = useState('');
  const [activeId, setActiveId] = useState({ type: '', id: null });

  const isRepliesActive =
    activeId?.id === item?._id && activeId?.type === 'replies';
  const isReportsActive =
    activeId?.id === item?._id && activeId?.type === 'reports';

  const handleToggle = (type) => {
    setActiveId((prev) =>
      prev.id === item._id && prev.type === type
        ? { id: null, type: '' }
        : { id: item._id, type }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReplyComment(item._id, text, activeId.type);
    setText('');
  };

  const renderReplies = () =>
    item.replies?.map((reply, index) => (
      <div
        key={index}
        className="mb-3 flex max-sm:flex-col gap-4 p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2 items-center">
          <p className="px-3 py-1 rounded-full bg-gray-300 text-slate-800">
            {reply?.createdBy?.fullName?.charAt(0)}
          </p>
          <div className="flex flex-col">
            <span className="font-semibold">{reply?.createdBy?.fullName}</span>
            <span className="text-gray-500 text-xs">
              {format(new Date(reply?.createdAt), 'dd MMM yyyy, h:mm a')}
            </span>
          </div>
        </div>
        <p className="flex-1/2">{reply?.text}</p>
      </div>
    ));

  const renderReports = () =>
    item.reports?.map((reply, index) => (
      <div
        key={index}
        className="mb-3 flex max-sm:flex-col gap-4 p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2 items-center">
          <p className="px-3 py-1 rounded-full bg-gray-300 text-slate-800">
            {reply?.createdBy?.fullName?.charAt(0)}
          </p>
          <div className="flex flex-col">
            <span className="font-semibold">{reply?.createdBy?.fullName}</span>
            <span className="text-gray-500 text-xs">
              {format(new Date(reply?.reportedAt), 'dd MMM yyyy, h:mm a')}
            </span>
          </div>
        </div>
        <p className="flex-1/2">{reply?.reason}</p>
      </div>
    ));

  const renderForm = (placeholder, buttonText) => (
    <form onSubmit={handleSubmit} className="items-center flex gap-2">
      <input
        className="border w-full border-indigo-300 px-4 py-2 rounded-lg text-sm"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        disabled={!text.trim()}
        className="w-fit text-sm btn bg-indigo-600 capitalize text-white disabled:opacity-50">
        {buttonText}
      </button>
    </form>
  );

  return (
    <>
      <div className="flex items-center gap-5">
        <CommentLike reviewId={item._id} likes={item.likes} />

        <button
          title="comment reply"
          onClick={() => handleToggle('replies')}
          className={`svg-btn text-xs flex gap-1 !w-16 ${activeId?.type === 'replies' && 'bg-indigo-200'}`}>
          <MessageSquare size={16} />
          {item.replies?.length || 0}
        </button>

        <button
          title="comment report"
          onClick={() => handleToggle('reports')}
          className={`svg-btn text-xs flex gap-1 !w-16 ${activeId?.type === 'reports' && 'bg-indigo-200'}`}>
          <MessageSquareDiff size={16} />
          {item.reports?.length || 0}
        </button>
      </div>

      {isRepliesActive && (
        <>
          {renderForm('Write a reply...', 'Reply')}
          <h2 className="font-semibold px-2">All Replies</h2>
          {renderReplies()}
        </>
      )}

      {isReportsActive && (
        <>
          {renderForm('Write a reason...', 'Report')}
          <h2 className="font-semibold px-2">All Reports</h2>
          {renderReports()}
        </>
      )}
    </>
  );
};

export default CommentReply;
