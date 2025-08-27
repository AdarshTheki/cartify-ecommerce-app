import React, { useEffect, useRef, useState } from 'react';
import useApi from '../hooks/useApi';
import { axios, errorHandler, socket } from '../config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const NEW_CHAT_EVENT = 'newChat';
const LEAVE_CHAT_EVENT = 'leaveChat';
const UPDATE_GROUP_NAME_EVENT = 'updateGroupName';
const MESSAGE_RECEIVED_EVENT = 'messageReceived';
const MESSAGE_DELETE_EVENT = 'messageDeleted';
const SOCKET_ERROR_EVENT = 'socketError';

const useChat = () => {
  const { user } = useSelector((s) => s.auth);
  const currentChat = useRef(null);
  const [chat, setChat] = useState(null);
  const [unReadMessages, setUnReadMessages] = useState([]);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(true);
  const { data: users, callApi: callApiUsers } = useApi();
  const {
    data: chats,
    callApi: callApiChats,
    loading: chatsLoading,
    setData: setChats,
  } = useApi();
  const {
    data: messages,
    callApi: callApiMessages,
    loading: messagesLoading,
    setData: setMessages,
  } = useApi();

  useEffect(() => {
    callApiUsers('/user/admin', {}, 'get');
    callApiChats('/chats', {}, 'get');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chat) {
      currentChat.current = chat;
    }
  }, [chat]);

  const onSocketError = (message) => {
    toast.error(`${JSON.stringify(message)}`);
  };

  const onNewChat = (newChat) => {
    setChats((prev) => [newChat, ...prev]);
  };

  const onChatLeave = (leaveChat) => {
    setChats((prev) => prev.filter((c) => c._id !== leaveChat._id));
    if (leaveChat._id === currentChat.current?._id) {
      setChat(null);
    }
  };

  const onGroupUpdate = (groupChat) => {
    if (groupChat?._id === currentChat.current?._id) {
      // update chat details
    }
    setChats((prev) => [
      ...prev.map((c) => {
        if (c._id === groupChat?._id) {
          return groupChat;
        }
        return c;
      }),
    ]);
  };

  const onMessageDelete = (message) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
    // update chat last message
  };

  const onMessageRetrieved = (msg) => {
    if (msg?.chat === currentChat.current?._id) {
      setMessages((prev) => (prev ? [...prev, msg] : []));
    } else {
      setUnReadMessages((prev) => (prev ? [...prev, msg] : []));
    }
  };

  const onFetchMessages = (chatId) => {
    callApiMessages(`/messages/${chatId}`, {}, 'get');
  };

  const onCreateOrGetChat = async (userId) => {
    try {
      const res = await axios.post(`/chats/chat/${userId}`);
      if (res.data) {
        setChat(res.data.chat);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const onCreateGroupChat = async (name, participants = [], chatId) => {
    try {
      const method = chatId ? 'patch' : 'post';
      const url = chatId ? `/chats/group/${chatId}` : '/chats/group';
      await axios[method](url, {
        name,
        participants,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const onSendMessage = async (message, attachments, chatId) => {
    try {
      setSendMessageLoading(true);
      if (!message.trim()) return;

      const formData = new FormData();
      formData.append('content', message);

      if (attachments?.length > 0) {
        attachments?.forEach((_, i) => {
          formData.append('attachments', attachments[i]);
        });
      }
      await axios.post(`/messages/${chatId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleMessageDelete = async (messageId) => {
    try {
      await axios.delete(`/messages/${messageId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChatDeleted = async (chatId) => {
    try {
      await axios.delete(`/chats/chat/${chatId}`);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(NEW_CHAT_EVENT, onNewChat);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
    socket.on(MESSAGE_DELETE_EVENT, onMessageDelete);
    socket.on(SOCKET_ERROR_EVENT, onSocketError);

    return () => {
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
      socket.off(MESSAGE_DELETE_EVENT, onMessageDelete);
      socket.off(SOCKET_ERROR_EVENT, onSocketError);
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
    users: users?.docs?.filter((i) => i?._id !== user?._id) || [],
    chats: chats || [],
    messages: messages || [],
    chat,
  };
};

export default useChat;
