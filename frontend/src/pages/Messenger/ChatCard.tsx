import { memo, useCallback, useMemo } from 'react';
import { cn, formateTime, getChatObjectMetadata } from '../../utils';
import { EllipsisVertical } from 'lucide-react';
import { useDropdown } from '../../hooks';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';

type ChatCardProp = {
  item: ChatType;
  isActive: boolean;
  onDelete: () => Promise<void>;
  onClick: () => void;
  unreadCount: number;
  onLeave: (val: string) => void;
  onUpdate: () => void;
  user: UserType;
};

const ChatCard = memo(
  ({ item, isActive, onDelete, onClick, unreadCount, onLeave, onUpdate, user }: ChatCardProp) => {
    const { isOpen, dropdownRef, setIsOpen } = useDropdown();

    const chatMetadata = useMemo(() => getChatObjectMetadata(item, user), [item, user]);

    const handleMenuClick = useCallback(() => {
      setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    return (
      <div className={cn('relative group rounded w-full p-2', isActive && 'bg-indigo-100')}>
        <div ref={dropdownRef} className='flex gap-2 items-center justify-between'>
          {/* Avatar Section */}
          {item.isGroupChat ? (
            <div className='relative flex-shrink-0 flex justify-start items-center flex-nowrap w-10'>
              {item.participants.slice(0, 3).map((participant, i) => (
                <Avatar
                  className={cn(
                    'w-8 h-8 absolute',
                    i === 0 ? 'left-0 z-[3]' : i === 1 ? 'left-1.5 z-[2]' : 'left-3 z-[1]',
                  )}
                  key={participant._id}>
                  <AvatarImage src={participant.avatar} alt='avatar' />
                  <AvatarFallback className='bg-gray-300 text-gray-800 uppercase font-semibold'>
                    {participant?.fullName.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            <Avatar className='h-10 w-10'>
              <AvatarImage src={chatMetadata.avatar} alt='avatar' />
              <AvatarFallback className='bg-gray-300 text-gray-800 uppercase font-semibold'>
                {chatMetadata.title?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Chat Info */}
          <button className='flex-1 text-left ml-2 relative cursor-pointer' onClick={onClick}>
            <div className='flex items-center justify-between'>
              <p className='line-clamp-1'>{chatMetadata.title}</p>
              <small className='line-clamp-1 text-gray-500'>{formateTime(item.updatedAt)}</small>
              {unreadCount > 0 && (
                <span className='bg-green-600 h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <small className='line-clamp-1 text-gray-500'>
              {chatMetadata.lastMessage || 'No messages yet'}
            </small>
          </button>

          {/* Menu Button */}
          <button className='svg-btn !p-2' onClick={handleMenuClick}>
            <EllipsisVertical />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className='absolute top-12 right-4 flex flex-col justify-start bg-white p-2 shadow-lg z-30 text-sm rounded-l-4xl rounded-b-4xl'>
              <button onClick={() => onLeave(item._id)} className='btn hover:bg-slate-100'>
                Close {item?.isGroupChat ? 'Group' : 'Chat'}
              </button>
              {item?.isGroupChat && item.admin._id === user._id && (
                <>
                  <button className='btn hover:bg-slate-100' onClick={onUpdate}>
                    Edit Group
                  </button>
                  <button onClick={onDelete} className='btn text-rose-600 hover:bg-slate-100'>
                    Delete Group
                  </button>
                </>
              )}
              {!item?.isGroupChat && item?.admin._id === user?._id && (
                <button onClick={onDelete} className='btn text-rose-600 hover:bg-slate-100'>
                  Delete Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ChatCard;
