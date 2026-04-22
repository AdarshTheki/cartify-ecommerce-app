import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { errorHandler, socket, api } from '../services';
import { useAppSelector } from '../store/store';
import useApi from './useApi';
import type { Pagination, User, Chat, Message } from '../types';

const NEW_CHAT_EVENT = 'newChat';
const LEAVE_CHAT_EVENT = 'leaveChat';
const UPDATE_GROUP_NAME_EVENT = 'updateGroupName';
const MESSAGE_RECEIVED_EVENT = 'messageReceived';
const MESSAGE_DELETE_EVENT = 'messageDeleted';
const SOCKET_ERROR_EVENT = 'socketError';

const useChat = () => {
  const { user } = useAppSelector((s) => s.auth);
  const currentChat = useRef<Chat | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [unReadMessages, setUnReadMessages] = useState<Message[]>([]);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(true);
  const { data: users, callApi: callApiUsers } = useApi<Pagination<User>>();
  const {
    data: chats,
    callApi: callApiChats,
    loading: chatsLoading,
    setData: setChats,
  } = useApi<Chat[]>();
  const {
    data: messages,
    callApi: callApiMessages,
    loading: messagesLoading,
    setData: setMessages,
  } = useApi<Message[]>();

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

  const onNewChat = (newChat: Chat) => {
    setChats((prev) => (prev ? [newChat, ...prev] : []));
  };

  const onChatLeave = (leaveChat: Chat) => {
    setChats((prev) => (prev ? prev.filter((c) => c._id !== leaveChat._id) : []));
    if (leaveChat._id === currentChat.current?._id) {
      setChat(null);
    }
  };

  const onGroupUpdate = (groupChat: Chat) => {
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

  const onMessageDelete = (message: Message) => {
    console.log('message delete', message);
    setMessages((prev) => (prev ? prev.filter((msg) => msg._id !== message._id) : []));
    // update chat last message
  };

  const onMessageRetrieved = (msg: Message) => {
    console.log('messages retrieved', msg);
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
      const res = await api.post(`/chats/chat/${userId}`);
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
      await api[method](url, {
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
      await api.post(`/messages/${chatId}`, formData, {
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
      await api.delete(`/messages/${messageId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChatDeleted = async (chatId: string) => {
    try {
      await api.delete(`/chats/chat/${chatId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected');
    });
    socket.on(NEW_CHAT_EVENT, onNewChat);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
    socket.on(MESSAGE_DELETE_EVENT, onMessageDelete);
    socket.on(SOCKET_ERROR_EVENT, onSocketError);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
