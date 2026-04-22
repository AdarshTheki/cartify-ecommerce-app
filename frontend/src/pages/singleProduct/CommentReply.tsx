import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import CommentLike from './CommentLike';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Comment } from '../../types';

type CommentType = 'replies' | 'reports';

interface CommentTypeProp {
  id: string;
  type: CommentType;
}

interface CommentReplyProp {
  item: Comment;
  onReplyComment: (comment: string, text: string, type: CommentType) => Promise<void>;
}

const CommentReply = ({ item, onReplyComment }: CommentReplyProp) => {
  const [text, setText] = useState('');
  const [activeId, setActiveId] = useState<CommentTypeProp>({ type: 'replies', id: '' });

  // normalize the comment identifier once; _id is optional on the type
  const commentId = item._id || '';

  const isRepliesActive = activeId.id === commentId && activeId.type === 'replies';
  const isReportsActive = activeId.id === commentId && activeId.type === 'reports';

  const handleToggle = (type: CommentTypeProp['type']) => {
    setActiveId((prev) => {
      const isActive = prev.id === commentId && prev.type === type;
      return isActive ? { id: '', type: 'replies' } : { id: commentId, type };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onReplyComment(item._id || '', text, activeId.type);
    setText('');
  };

  const renderReplies = () =>
    item.replies?.map((reply, index) => (
      <div
        key={index}
        className='mb-3 flex max-sm:flex-col gap-4 p-4 rounded-lg border border-gray-200'>
        <div className='flex gap-2 items-center'>
          <p className='px-3 py-1 rounded-full bg-gray-300 text-slate-800'>
            {reply?.createdBy?.fullName?.charAt(0)}
          </p>
          <div className='flex flex-col'>
            <span className='font-semibold'>{reply?.createdBy?.fullName}</span>
            <span className='text-gray-500 text-xs'>
              {format(new Date(reply?.createdAt), 'dd MMM yyyy, h:mm a')}
            </span>
          </div>
        </div>
        <p className='flex-1/2'>{reply?.text}</p>
      </div>
    ));

  const renderReports = () =>
    item.reports?.map((reply, index) => (
      <div
        key={index}
        className='mb-3 flex max-sm:flex-col gap-4 p-4 rounded-lg border border-gray-200'>
        <div className='flex gap-2 items-center'>
          <p className='px-3 py-1 rounded-full bg-gray-300 text-slate-800'>
            {reply?.createdBy?.fullName?.charAt(0)}
          </p>
          <div className='flex flex-col'>
            <span className='font-semibold'>{reply?.createdBy?.fullName}</span>
            <span className='text-gray-500 text-xs'>
              {format(new Date(reply?.reportedAt), 'dd MMM yyyy, h:mm a')}
            </span>
          </div>
        </div>
        <p className='flex-1/2'>{reply?.reason}</p>
      </div>
    ));

  const renderForm = (placeholder: string, buttonText: string) => (
    <form onSubmit={handleSubmit} className='items-center flex gap-2'>
      <input
        className='border w-full border-indigo-300 px-4 py-2 rounded-lg text-sm'
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        disabled={!text.trim()}
        className='w-fit text-sm btn bg-indigo-600 capitalize text-white disabled:opacity-50'>
        {buttonText}
      </button>
    </form>
  );

  return (
    <>
      <div className='flex items-center gap-2'>
        <CommentLike reviewId={commentId} likes={item.likes} />

        <button onClick={() => handleToggle('replies')} className='text-xs flex gap-1 p-2'>
          <span className='font-semibold text-gray-600'>Reply</span>
          {activeId.id && activeId.type === 'replies' ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        <button onClick={() => handleToggle('reports')} className='text-xs flex gap-1 p-2'>
          <span className='font-semibold text-gray-600'>Report</span>
          {activeId.id && activeId.type === 'reports' ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      </div>

      {isRepliesActive && (
        <>
          {renderForm('Write a reply...', 'Reply')}
          <h2 className='font-semibold px-2'>All Replies</h2>
          {renderReplies()}
        </>
      )}

      {isReportsActive && (
        <>
          {renderForm('Write a reason...', 'Report')}
          <h2 className='font-semibold px-2'>All Reports</h2>
          {renderReports()}
        </>
      )}
    </>
  );
};

export default CommentReply;
