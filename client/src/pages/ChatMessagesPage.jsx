// ChatApplication.jsx - Main combined component
import React, { useState, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  ImageUp,
  Plus,
  Search,
  Send,
  Trash2Icon,
  X,
  EllipsisVertical,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  socket,
  classNames,
  getChatObjectMetadata,
  formatChatTime,
} from '../config';
import { Avatar, Input, Loading } from '../utils';
import useChat from '../hooks/useChat';
import useDropdown from '../hooks/useDropdown';
import { toast } from 'react-toastify';

// Optimized Message Component with React.memo
const Message = React.memo(({ item, onDelete, sender }) => (
  <div
    className={classNames(
      'flex flex-col gap-2 mb-2',
      !sender ? 'justify-start' : 'items-end'
    )}>
    <div
      className={classNames(
        'relative cursor-pointer group w-fit py-2 px-5 shadow',
        sender
          ? '!bg-indigo-100 rounded-l-4xl rounded-t-4xl'
          : 'bg-white rounded-r-4xl rounded-b-4xl'
      )}>
      <button
        onClick={onDelete}
        className="text-red-600 hidden group-hover:block absolute right-2 top-1 p-2 rounded-full bg-white">
        <Trash2Icon size={18} />
      </button>
      <div className="flex gap-2 items-end">
        {item?.content && <p>{item?.content}</p>}
        <small className="text-nowrap" style={{ fontWeight: 400 }}>
          {formatChatTime(item?.updatedAt)}
        </small>
      </div>
      {item?.attachments?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 max-w-[200px]">
          {item.attachments.map((attachment, index) => (
            <a
              href={attachment}
              target="_blank"
              rel="noopener noreferrer"
              key={index}>
              <img
                src={attachment}
                alt={`attachment-${index}`}
                className="aspect-square w-full border border-gray-300 object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
));

// Optimized ChatItem Component with React.memo
const ChatItem = React.memo(
  ({
    item,
    isActive,
    onDelete,
    onClick,
    unreadCount,
    onLeave,
    onUpdate,
    user,
  }) => {
    const { isOpen, dropdownRef, setIsOpen } = useDropdown();

    const chatMetadata = useMemo(
      () => getChatObjectMetadata(item, user),
      [item, user]
    );

    const handleMenuClick = useCallback(() => {
      setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    return (
      <div
        className={classNames(
          'relative group rounded w-full p-2',
          isActive && 'bg-indigo-100'
        )}>
        <div
          ref={dropdownRef}
          className="flex gap-2 items-center justify-between">
          {/* Avatar Section */}
          {item.isGroupChat ? (
            <div className="w-10 relative h-10 flex-shrink-0 flex justify-start items-center flex-nowrap">
              {item.participants.slice(0, 3).map((participant, i) => (
                <Avatar
                  key={participant._id}
                  name={participant.fullName.substring(0, 2)}
                  avatarUrl={participant?.avatar}
                  className={classNames(
                    'w-8 h-8 border-[1px] border-white rounded-full object-cover absolute outline outline-dark group-hover:outline-secondary',
                    i === 0
                      ? 'left-0 z-[3]'
                      : i === 1
                        ? 'left-1.5 z-[2]'
                        : 'left-3 z-[1]'
                  )}
                />
              ))}
            </div>
          ) : (
            <Avatar
              avatarUrl={chatMetadata.avatar}
              name={chatMetadata.title}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}

          {/* Chat Info */}
          <button
            className="flex-1 text-left ml-2 relative cursor-pointer"
            onClick={onClick}>
            <p className="line-clamp-1">{chatMetadata.title}</p>
            <small className="line-clamp-1 text-gray-500">
              {chatMetadata.lastMessage || 'No messages yet'}
            </small>
            <div className="flex items-center justify-between">
              <small className="line-clamp-1 text-gray-500">
                {formatChatTime(item?.updatedAt)}
              </small>
              {unreadCount > 0 && (
                <span className="bg-green-600 h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>

          {/* Menu Button */}
          <button className="svg-btn !p-2" onClick={handleMenuClick}>
            <EllipsisVertical />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-12 right-4 flex flex-col justify-start bg-white p-2 shadow-lg z-30 text-sm rounded-l-4xl rounded-b-4xl">
              <button
                onClick={() => onLeave(item._id)}
                className="btn hover:bg-slate-100">
                Leave {item?.isGroupChat ? 'Group' : 'Chat'}
              </button>
              {item?.isGroupChat && item?.admin === user?._id && (
                <>
                  <button className="btn hover:bg-slate-100" onClick={onUpdate}>
                    Edit Group
                  </button>
                  <button
                    onClick={onDelete}
                    className="btn text-rose-600 hover:bg-slate-100">
                    Delete Group
                  </button>
                </>
              )}
              {!item?.isGroupChat && item?.admin === user?._id && (
                <button
                  onClick={onDelete}
                  className="btn text-rose-600 hover:bg-slate-100">
                  Delete Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Modal Component for creating/updating chats
const ChatModal = React.memo(
  ({ isOpen, onClose, chat, users, onCreateGroupChat, onCreateOrGetChat }) => {
    const [groupName, setGroupName] = useState(chat?.name || '');
    const [isGroupChat, setIsGroupChat] = useState(!!chat?.isGroupChat);
    const [selectUserId, setSelectUserId] = useState('');
    const [selectedValues, setSelectedValues] = useState(
      chat?.participants?.map((i) => i?._id) || []
    );

    const handleCheckboxChange = useCallback(
      (event) => {
        const { value, checked } = event.target;

        if (isGroupChat) {
          setSelectedValues((prev) =>
            checked ? [...prev, value] : prev.filter((val) => val !== value)
          );
          setSelectUserId('');
        } else {
          setSelectUserId(value);
          setSelectedValues([]);
        }
      },
      [isGroupChat]
    );

    const handleSubmit = useCallback(async () => {
      if (isGroupChat) {
        if (!groupName || selectedValues.length === 0) {
          toast.error('Please provide a Group Name and add Participants');
          return;
        }
        onCreateGroupChat(groupName, selectedValues, chat?._id);
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
      <div className="fixed inset-0 bg-black/10 flex justify-center items-center h-full z-50">
        <div className="bg-white rounded-xl p-6 w-96 shadow-xl space-y-5">
          <p className="text-xl font-medium">
            {chat?._id ? 'Update Group Chat' : 'Create Chat'}
          </p>

          {!chat?._id && (
            <label htmlFor="group-chat" className="flex gap-2 items-center">
              <input
                onChange={() => setIsGroupChat(!isGroupChat)}
                type="checkbox"
                id="group-chat"
                checked={isGroupChat}
              />
              Create Group Chat ?
            </label>
          )}

          {isGroupChat && (
            <Input
              label="Group Name"
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          )}

          <div className="max-h-[200px] overflow-y-auto">
            <p className="mb-1">Participants:</p>
            {users?.map((option) => (
              <div key={option._id}>
                <label htmlFor={option._id} className="block">
                  <input
                    type="checkbox"
                    id={option._id}
                    value={option._id}
                    checked={
                      isGroupChat
                        ? selectedValues.includes(option._id)
                        : selectUserId === option._id
                    }
                    onChange={handleCheckboxChange}
                  />
                  <span className="pl-2 py-2 text-sm">{option.fullName}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-5 text-center font-medium">
            <button
              className="btn text-red-600 border border-red-600 flex-1"
              onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary flex-1" onClick={handleSubmit}>
              {chat?._id ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// Main Chat Application Component
const ChatApplication = () => {
  const [message, setMessage] = useState('');
  const [updateChat, setUpdateChat] = useState(null);
  const [openAddChat, setOpenAddChat] = useState(false);
  const [searchUserChat, setSearchUserChat] = useState('');
  const [previews, setPreviews] = useState([]);
  const [attachments, setAttachments] = useState([]);
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
  } = useChat();

  const { user } = useSelector((state) => state.auth);

  // Memoized filtered users for search
  const filteredUsers = useMemo(() => {
    if (!searchUserChat) return [];
    return users.filter((i) =>
      i?.fullName?.toLowerCase().includes(searchUserChat.toLowerCase())
    );
  }, [users, searchUserChat]);

  // Memoized handlers
  const handlePreviewAttachments = useCallback((e) => {
    const files = e.target.files;
    const fileArray = Array.from(files).slice(0, 5);
    setPreviews(fileArray.map((file) => URL.createObjectURL(file)));
    setAttachments(fileArray);
  }, []);

  const handleRemoveAttachment = useCallback((index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!message.trim()) return;

      await onSendMessage(message, attachments, chat?._id);
      setMessage('');
      setAttachments([]);
      setPreviews([]);
    },
    [message, attachments, chat?._id, onSendMessage]
  );

  const handleChatClick = useCallback(
    (chatItem) => {
      setMobileChatOpen(true);
      socket.emit('joinChat', chatItem._id);
      setChat({ ...chatItem });
      onFetchMessages(chatItem._id);
      setUnReadMessages((prev) => prev.filter((n) => n.chat !== chatItem._id));
    },
    [setMobileChatOpen, setChat, onFetchMessages, setUnReadMessages]
  );

  const handleLeaveChat = useCallback(
    (chatId) => {
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (chat?._id === chatId) {
        setChat(null);
      }
    },
    [setChats, chat?._id, setChat]
  );

  return (
    <div className="h-screen">
      <div className="flex max-sm:flex-col h-full">
        {/* Chat Sidebar */}
        <div
          className={classNames(
            'max-sm:w-full sm:w-1/3 min-w-[300px] h-full overflow-y-scroll',
            mobileChatOpen && chat?._id && 'max-sm:hidden'
          )}>
          {/* Chat Modal */}
          <ChatModal
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

          <div className="flex flex-col relative">
            {/* Search Bar */}
            <div className="flex items-center px-2 py-2 w-full shadow-sm">
              <Search />
              <Input
                name="search"
                title="search chat user"
                placeholder="Search..."
                className="border-none flex-1 outline-none"
                onChange={(e) => setSearchUserChat(e.target.value)}
                value={searchUserChat}
              />
              <button
                title={searchUserChat ? 'Close search' : 'Add new chat'}
                className="bg-indigo-600 hover:opacity-80 text-white w-[100px] py-2 gap-2 flex items-center justify-center rounded-2xl"
                onClick={() =>
                  searchUserChat ? setSearchUserChat('') : setOpenAddChat(true)
                }>
                {searchUserChat ? <X size={18} /> : <Plus size={18} />}
                <span>{searchUserChat ? 'Close' : 'Add'}</span>
              </button>
            </div>

            {/* Search Results */}
            {searchUserChat && (
              <div className="flex flex-col absolute top-14 shadow-md z-10 w-full min-h-[300px] bg-white">
                {filteredUsers.map((item) => (
                  <button
                    onClick={() => {
                      onCreateOrGetChat(item._id);
                      setSearchUserChat('');
                    }}
                    className="text-left w-full flex gap-2 items-center hover:bg-gray-100 py-1 pl-5"
                    key={item?._id}>
                    <div className="scale-75">
                      <Avatar name={item?.fullName} avatarUrl={item?.avatar} />
                    </div>
                    <span>{item?.fullName}</span>
                  </button>
                ))}
              </div>
            )}

            {chatsLoading && <Loading />}

            {/* Chat List */}
            {Array.isArray(chats) &&
              chats.map((item) => (
                <ChatItem
                  key={item?._id}
                  item={item}
                  user={user}
                  unreadCount={
                    unReadMessages.filter((n) => n.chat === item._id).length
                  }
                  isActive={chat?._id === item?._id}
                  onUpdate={() => {
                    setUpdateChat(item);
                    setOpenAddChat(true);
                  }}
                  onDelete={() => handleChatDeleted(item._id)}
                  onLeave={handleLeaveChat}
                  onClick={() => handleChatClick(item)}
                />
              ))}
          </div>
        </div>

        {/* Empty State */}
        {!chat?._id && (
          <div className="w-full max-sm:hidden flex items-center justify-center">
            <p className="flex items-center h-[50vh] justify-center text-gray-500">
              Select a chat to start messaging
            </p>
          </div>
        )}

        {/* Messages Area */}
        {chat?._id && (
          <div
            className={classNames(
              'w-full max-sm:hidden overflow-y-auto flex flex-col',
              mobileChatOpen && '!flex'
            )}>
            {/* Chat Header */}
            <div className="py-2 px-4 flex items-center gap-3 top-0 sticky z-10 bg-white shadow-sm">
              <button
                className="svg-btn !p-2"
                onClick={() => setMobileChatOpen(false)}>
                <ArrowLeft />
              </button>
              <Avatar
                name={getChatObjectMetadata(chat, user).title}
                avatarUrl={getChatObjectMetadata(chat, user).avatar}
              />
              <div>
                <p className="font-medium">
                  {getChatObjectMetadata(chat, user).title}
                </p>
                {chat.isGroupChat && (
                  <p className="text-xs font-light text-gray-500">
                    {chat.participants?.length} members
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messagesLoading && <Loading />}
              <div className="min-h-[60dvh]">
                {messages.map((item) => (
                  <Message
                    key={item?._id}
                    item={item}
                    onDelete={() => handleMessageDelete(item?._id)}
                    sender={item?.sender?._id === user?._id}
                  />
                ))}
                {!messages?.length && !messagesLoading && (
                  <p className="text-center text-gray-500 mt-10">
                    No messages yet
                  </p>
                )}
              </div>
            </div>

            {/* Attachment Previews */}
            {previews?.length > 0 && (
              <div className="w-full flex flex-wrap px-4 gap-2 items-center justify-center sticky bottom-14 bg-white/90 backdrop-blur-sm py-2">
                {previews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt="attachment preview"
                      className="w-20 h-20 rounded object-cover"
                    />
                    <Trash2Icon
                      onClick={() => handleRemoveAttachment(i)}
                      size={16}
                      className="absolute top-1 right-1 text-red-600 cursor-pointer bg-white rounded-full p-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="w-full py-2 px-4 flex gap-2 items-center sticky bottom-0">
              <div className="h-[40px] px-2 rounded-2xl shadow-md w-full flex items-center">
                <Input
                  className="border-none"
                  name="message"
                  placeholder="Enter a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <label
                  title="Attach files (max 5)"
                  htmlFor="attachments"
                  className="cursor-pointer p-2">
                  <ImageUp className="w-5 h-5" />
                  <input
                    type="file"
                    multiple
                    onChange={handlePreviewAttachments}
                    id="attachments"
                    name="attachments"
                    className="hidden"
                  />
                </label>
              </div>
              <button
                disabled={sendMessageLoading}
                type="submit"
                className="bg-indigo-600 text-white h-[40px] flex gap-2 rounded-2xl px-5 hover:opacity-80 items-center disabled:opacity-50">
                {sendMessageLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={16} />
                )}
                <span className="max-sm:hidden">Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApplication;
