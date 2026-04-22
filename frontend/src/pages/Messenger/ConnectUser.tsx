import { MessageCircle, Users, X } from 'lucide-react';
import { memo, useCallback, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import type { Chat, User } from '../../types';

type ConnectUserProp = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onCreateGroupChat: (name: string, selects: string[], id: string) => void;
  onCreateOrGetChat: (select: string) => void;
  chat: Chat | null;
};

const ConnectUser = memo(
  ({ isOpen, onClose, chat, users, onCreateGroupChat, onCreateOrGetChat }: ConnectUserProp) => {
    const [groupName, setGroupName] = useState(chat?.name || '');
    const [isGroupChat, setIsGroupChat] = useState(!!chat?.isGroupChat);
    const [selectUserId, setSelectUserId] = useState('');
    const [selectedValues, setSelectedValues] = useState<string[]>(
      chat?.participants?.map((i) => i?._id) || [],
    );

    const handleCheckboxChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (isGroupChat) {
          setSelectedValues((prev) =>
            checked ? [...prev, value] : prev.filter((val) => val !== value),
          );
          setSelectUserId('');
        } else {
          setSelectUserId(value);
          setSelectedValues([]);
        }
      },
      [isGroupChat],
    );

    const handleSubmit = useCallback(() => {
      if (isGroupChat) {
        if (!groupName || selectedValues.length === 0) {
          toast.error('Please provide a Group Name and add Participants');
          return;
        }
        onCreateGroupChat(groupName, selectedValues, chat?._id || '');
      } else {
        if (!selectUserId) {
          toast.error('Please select a user');
          return;
        }
        onCreateOrGetChat(selectUserId);
      }
      onClose();
    }, [
      isGroupChat,
      groupName,
      selectedValues,
      selectUserId,
      chat,
      onCreateGroupChat,
      onCreateOrGetChat,
      onClose,
    ]);

    if (!isOpen) return null;

    return (
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50'>
        <div className='bg-white rounded-2xl p-6 w-[420px] shadow-2xl animate-in fade-in zoom-in-95 space-y-5 relative'>
          {/* Header */}
          <div className='flex justify-between items-center border-b pb-3 border-gray-300'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              {isGroupChat ? (
                <>
                  <Users className='w-5 h-5 text-indigo-500' />
                  {chat?._id ? 'Update Group Chat' : 'Create Group Chat'}
                </>
              ) : (
                <>
                  <MessageCircle className='w-5 h-5 text-green-500' />
                  {chat?._id ? 'Update Chat' : 'Start New Chat'}
                </>
              )}
            </h2>
            <button onClick={onClose} className='p-1 rounded-full hover:bg-gray-100 transition'>
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          {/* Group Chat Toggle */}
          {!chat?._id && (
            <label className='flex items-center gap-2 text-sm cursor-pointer'>
              <input
                type='checkbox'
                checked={isGroupChat}
                onChange={() => setIsGroupChat(!isGroupChat)}
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <span>Create Group Chat</span>
            </label>
          )}

          {/* Group Name Input */}
          {isGroupChat && (
            <div>
              <label className='block text-sm mb-1 font-medium text-gray-700'>Group Name</label>
              <input
                type='text'
                placeholder='Enter group name...'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400'
              />
            </div>
          )}

          {/* Participants */}
          <div className='max-h-[220px] overflow-y-auto border border-gray-300 rounded-lg p-2'>
            <p className='text-sm font-medium text-gray-600 mb-2'>Participants</p>
            <div className='space-y-2'>
              {users?.map((option) => (
                <label key={option._id} className='flex items-center gap-2 cursor-pointer text-sm'>
                  <input
                    type='checkbox'
                    value={option._id}
                    checked={
                      isGroupChat
                        ? selectedValues.includes(option._id)
                        : selectUserId === option._id
                    }
                    onChange={handleCheckboxChange}
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                  />
                  <span>{option.fullName}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-4 pt-3'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2 border rounded-lg text-red-600 border-red-500 hover:bg-red-50 transition'>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition'>
              {chat?._id ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
export default ConnectUser;
