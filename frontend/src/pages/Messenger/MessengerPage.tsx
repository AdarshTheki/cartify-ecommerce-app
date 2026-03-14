import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppSelector } from '../../redux/store';
import { useMessenger } from '../../hooks';
import { cn, getChatObjectMetadata } from '../../utils';
import { ArrowLeft, ImageUp, Plus, Search, Send, Trash2Icon, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import ChatCard from './ChatCard';
import ConnectUser from './ConnectUser';
import MessageCard from './MessageCard';
import { DataState } from '../../components';
import { socketInstance } from '../../services';

// Main Chat Application Component
const CustomerChatPage = () => {
  const [message, setMessage] = useState('');
  const [updateChat, setUpdateChat] = useState<ChatType | null>(null);
  const [openAddChat, setOpenAddChat] = useState(false);
  const [searchUserChat, setSearchUserChat] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(true);

  const {
    onCreateOrGetChat,
    onFetchMessages,
    onSendMessage,
    setChats,
    setUnReadMessages,
    handleChatDeleted,
    handleMessageDelete,
    onCreateGroupChat,
    unReadMessages,
    sendMessageLoading,
    messagesLoading,
    chatsLoading,
    users,
    chats,
    messages,
    chat,
    setChat,
  } = useMessenger();

  const { user } = useAppSelector((state) => state.auth);

  // Memoized filtered users for search
  const filteredUsers = useMemo(() => {
    if (!searchUserChat) return [];
    return users?.filter((i) => i?.fullName?.toLowerCase().includes(searchUserChat.toLowerCase()));
  }, [users, searchUserChat]);

  // Memoized handlers
  const handlePreviewAttachments = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const files = target && (target.files as FileList);
    setPreviews(files && Array.from(files).map((file) => URL.createObjectURL(file)));
    setAttachments(files ? Array.from(files) : []);
  }, []);

  const handleRemoveAttachment = useCallback((index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      await onSendMessage(message, attachments, chat?._id || '');
      setMessage('');
      setAttachments([]);
      setPreviews([]);
    },
    [message, attachments, chat?._id, onSendMessage],
  );

  const handleChatClick = useCallback(
    (chatItem: ChatType) => {
      setMobileChatOpen(true);
      socketInstance.emit('joinChat', chatItem._id);
      setChat({ ...chatItem });
      onFetchMessages(chatItem._id);
      setUnReadMessages((prev) => (prev ? prev.filter((n) => n.chat._id !== chatItem._id) : []));
    },
    [setMobileChatOpen, setChat, onFetchMessages, setUnReadMessages],
  );

  const handleLeaveChat = useCallback(
    (chatId: string) => {
      setChats((prev) => (prev ? prev.filter((c) => c._id !== chatId) : []));
      if (chat?._id === chatId) {
        setChat(null);
      }
    },
    [setChats, chat?._id, setChat],
  );

  return (
    <div className='h-[90vh] border-b border-gray-300'>
      <div className='flex max-sm:flex-col h-full'>
        {/* Chat Sidebar */}
        <div
          className={cn(
            'max-sm:w-full sm:w-1/3 min-w-[300px] h-full overflow-y-scroll',
            mobileChatOpen && chat?._id && 'max-sm:hidden',
          )}>
          {/* Chat Modal */}
          <ConnectUser
            isOpen={openAddChat}
            onClose={() => {
              setOpenAddChat(false);
              setUpdateChat(null);
            }}
            chat={updateChat}
            users={users}
            onCreateGroupChat={onCreateGroupChat}
            onCreateOrGetChat={onCreateOrGetChat}
          />

          <div className='flex flex-col relative'>
            {/* Search Bar */}
            <div className='flex items-center px-2 py-2 w-full shadow-sm'>
              <Search className='min-w-6' />
              <input
                name='search'
                title='search chat user'
                placeholder='Search...'
                className='border-none w-full px-2 outline-none'
                onChange={(e) => setSearchUserChat(e.target.value)}
                value={searchUserChat}
              />
              <button
                title={searchUserChat ? 'Close search' : 'Add new chat'}
                className='bg-indigo-600 hover:opacity-80 text-white min-w-[100px] py-2 gap-2 flex items-center justify-center rounded-2xl'
                onClick={() => (searchUserChat ? setSearchUserChat('') : setOpenAddChat(true))}>
                {searchUserChat ? <X size={18} /> : <Plus size={18} />}
                <span>{searchUserChat ? 'Close' : 'Add'}</span>
              </button>
            </div>

            {/* Search Results */}
            {searchUserChat && (
              <div className='flex flex-col absolute top-14 shadow-md z-10 w-full min-h-[300px] bg-white'>
                {filteredUsers.map((item) => (
                  <button
                    onClick={() => {
                      onCreateOrGetChat(item._id);
                      setSearchUserChat('');
                    }}
                    className='text-left w-full flex gap-2 items-center hover:bg-gray-100 py-1 pl-5'
                    key={item?._id}>
                    <Avatar>
                      <AvatarImage src={item.avatar} alt='avatar' className='h-8' />
                      <AvatarFallback>{item.fullName.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span>{item?.fullName}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat Listing */}
            <DataState data={chats} loading={chatsLoading} error={''}>
              {(data) =>
                data.map((item) => (
                  <ChatCard
                    key={item?._id}
                    item={item}
                    user={user!}
                    unreadCount={unReadMessages.filter((n) => n.chat._id === item._id).length}
                    isActive={chat?._id === item?._id}
                    onUpdate={() => {
                      setUpdateChat(item);
                      setOpenAddChat(true);
                    }}
                    onDelete={() => handleChatDeleted(item._id)}
                    onLeave={handleLeaveChat}
                    onClick={() => handleChatClick(item)}
                  />
                ))
              }
            </DataState>
          </div>
        </div>

        {/* Empty State */}
        {!chat?._id && (
          <div className='w-full max-sm:hidden flex items-center justify-center'>
            <p className='flex items-center h-[50vh] justify-center text-gray-500'>
              Select a chat to start messaging
            </p>
          </div>
        )}

        {/* Messages Area */}
        {chat?._id && (
          <div
            className={cn(
              'w-full max-sm:hidden overflow-y-auto flex flex-col',
              mobileChatOpen && '!flex',
            )}>
            {/* Chat Header */}
            <div className='py-2 px-4 flex items-center gap-3 top-0 sticky z-10 bg-white shadow-sm'>
              <button className='svg-btn !p-2' onClick={() => setMobileChatOpen(false)}>
                <ArrowLeft />
              </button>
              <Avatar>
                <AvatarImage
                  className='h-8'
                  src={getChatObjectMetadata(chat, user!).avatar}
                  alt='avatar'
                />
                <AvatarFallback className='bg-indigo-600 text-white uppercase font-bold'>
                  {getChatObjectMetadata(chat, user!).title?.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{getChatObjectMetadata(chat, user!).title}</p>
                {chat.isGroupChat ? (
                  <p className='text-xs font-light text-gray-500'>
                    Group {chat.participants?.length} members
                  </p>
                ) : (
                  <p className='text-xs font-light text-gray-500'>one-on-one chat</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 p-4 overflow-y-auto'>
              <DataState data={messages} loading={messagesLoading} error={''}>
                {(messaging) => (
                  <div className='min-h-[60dvh]'>
                    {messaging.map((item) => (
                      <MessageCard
                        key={item?._id}
                        item={item}
                        onDelete={() => handleMessageDelete(item?._id)}
                        sender={item?.sender?._id === user?._id}
                      />
                    ))}
                  </div>
                )}
              </DataState>
            </div>

            {/* Attachment Previews */}
            {previews?.length > 0 && (
              <div className='w-full flex flex-wrap px-4 gap-2 items-center justify-center sticky bottom-14 bg-white/90 backdrop-blur-sm py-2'>
                {previews.map((preview, i) => (
                  <div key={i} className='relative'>
                    <img
                      src={preview}
                      alt='attachment preview'
                      className='w-20 h-20 rounded object-cover'
                    />
                    <Trash2Icon
                      onClick={() => handleRemoveAttachment(i)}
                      size={16}
                      className='absolute top-1 right-1 text-red-600 cursor-pointer bg-white rounded-full p-1'
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className='w-full sticky sm:bottom-0 bottom-12 p-2 bg-white/40'>
              <div className='h-[40px] w-full flex items-center gap-1'>
                <input
                  className='p-2 w-full px-4 rounded-lg border border-gray-300 outline-indigo-300'
                  name='message'
                  placeholder='Enter a message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <label
                  title='Attach files (max 5)'
                  htmlFor='attachments'
                  className='bg-indigo-600 text-white flex gap-2 rounded-lg px-4 h-full items-center hover:opacity-80'>
                  <ImageUp size={16} />
                  <small className='max-sm:hidden font-medium'>Upload</small>
                  <input
                    type='file'
                    multiple
                    onChange={handlePreviewAttachments}
                    id='attachments'
                    name='attachments'
                    className='hidden'
                  />
                </label>
                <button
                  disabled={sendMessageLoading}
                  type='submit'
                  className='bg-indigo-600 text-white flex gap-2 rounded-lg px-4 h-full items-center hover:opacity-80 disabled:opacity-50'>
                  {sendMessageLoading ? (
                    <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                  ) : (
                    <Send size={16} />
                  )}
                  <small className='max-sm:hidden font-medium'>Send</small>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomerChatPage;
