import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance, errorHandler, socketInstance } from '../services';
import { useAppSelector } from '../redux/store';
import useApi from './useApi';

const NEW_CHAT_EVENT = 'newChat';
const LEAVE_CHAT_EVENT = 'leaveChat';
const UPDATE_GROUP_NAME_EVENT = 'updateGroupName';
const MESSAGE_RECEIVED_EVENT = 'messageReceived';
const MESSAGE_DELETE_EVENT = 'messageDeleted';
const SOCKET_ERROR_EVENT = 'socketError';

const useChat = () => {
  const { user } = useAppSelector((s) => s.auth);
  const currentChat = useRef<ChatType | null>(null);
  const [chat, setChat] = useState<ChatType | null>(null);
  const [unReadMessages, setUnReadMessages] = useState<MessageType[]>([]);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(true);
  const { data: users, callApi: callApiUsers } = useApi<PaginationType<UserType>>();
  const {
    data: chats,
    callApi: callApiChats,
    loading: chatsLoading,
    setData: setChats,
  } = useApi<ChatType[]>();
  const {
    data: messages,
    callApi: callApiMessages,
    loading: messagesLoading,
    setData: setMessages,
  } = useApi<MessageType[]>();

  useEffect(() => {
    callApiUsers('/user/admin');
    callApiChats('/chats');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chat) {
      currentChat.current = chat;
    }
  }, [chat]);

  const onSocketError = (message: string) => {
    toast.error(`${JSON.stringify(message)}`);
  };

  const onNewChat = (newChat: ChatType) => {
    setChats((prev) => (prev ? [newChat, ...prev] : []));
  };

  const onChatLeave = (leaveChat: ChatType) => {
    setChats((prev) => (prev ? prev.filter((c) => c._id !== leaveChat._id) : []));
    if (leaveChat._id === currentChat.current?._id) {
      setChat(null);
    }
  };

  const onGroupUpdate = (groupChat: ChatType) => {
    if (groupChat?._id === currentChat.current?._id) {
      // update chat details
    }
    setChats((prev) => [
      ...(prev
        ? prev.map((c) => {
            if (c._id === groupChat?._id) {
              return groupChat;
            }
            return c;
          })
        : []),
    ]);
  };

  const onMessageDelete = (message: MessageType) => {
    setMessages((prev) => (prev ? prev.filter((msg) => msg._id !== message._id) : []));
    // update chat last message
  };

  const onMessageRetrieved = (msg: MessageType) => {
    if (msg?.chat._id === currentChat.current?._id) {
      setMessages((prev) => (prev ? [...prev, msg] : []));
    } else {
      setUnReadMessages((prev) => (prev ? [...prev, msg] : []));
    }
  };

  const onFetchMessages = (chatId: string) => {
    callApiMessages(`/messages/${chatId}`);
  };

  const onCreateOrGetChat = async (userId: string) => {
    try {
      const res = await axiosInstance.post(`/chats/chat/${userId}`);
      if (res.data) {
        setChat(res.data.chat);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const onCreateGroupChat = async (name: string, participants: string[] = [], chatId?: string) => {
    try {
      const method = chatId ? 'patch' : 'post';
      const url = chatId ? `/chats/group/${chatId}` : '/chats/group';
      await axiosInstance[method](url, {
        name,
        participants,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const onSendMessage = async (
    message: string,
    attachments: File[] | undefined,
    chatId: string,
  ) => {
    try {
      setSendMessageLoading(true);
      if (!message.trim()) return;

      const formData = new FormData();
      formData.append('content', message);

      if (attachments && attachments.length > 0) {
        attachments.forEach((_, i) => {
          formData.append('attachments', attachments[i]);
        });
      }
      await axiosInstance.post(`/messages/${chatId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleMessageDelete = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChatDeleted = async (chatId: string) => {
    try {
      await axiosInstance.delete(`/chats/chat/${chatId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (!socketInstance) return;

    socketInstance.on(NEW_CHAT_EVENT, onNewChat);
    socketInstance.on(LEAVE_CHAT_EVENT, onChatLeave);
    socketInstance.on(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
    socketInstance.on(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
    socketInstance.on(MESSAGE_DELETE_EVENT, onMessageDelete);
    socketInstance.on(SOCKET_ERROR_EVENT, onSocketError);

    return () => {
      socketInstance.off(NEW_CHAT_EVENT, onNewChat);
      socketInstance.off(LEAVE_CHAT_EVENT, onChatLeave);
      socketInstance.off(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
      socketInstance.off(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
      socketInstance.off(MESSAGE_DELETE_EVENT, onMessageDelete);
      socketInstance.off(SOCKET_ERROR_EVENT, onSocketError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketInstance]);

  return {
    onCreateGroupChat,
    onCreateOrGetChat,
    onFetchMessages,
    onSendMessage,
    setChats,
    setMessages,
    setChat,
    onSocketError,
    onChatLeave,
    onNewChat,
    onGroupUpdate,
    onMessageDelete,
    onMessageRetrieved,
    setUnReadMessages,
    handleMessageDelete,
    handleChatDeleted,
    setMobileChatOpen,
    mobileChatOpen,
    sendMessageLoading,
    messagesLoading,
    chatsLoading,
    unReadMessages,
    users: users?.docs?.filter((i) => i._id !== user?._id) || [],
    chats: chats || [],
    messages: messages || [],
    chat,
  };
};

export default useChat;
