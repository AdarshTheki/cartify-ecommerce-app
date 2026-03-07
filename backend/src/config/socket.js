import { User } from '../models/user.model.js';
import { logger } from '../middlewares/logger.middleware.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

export const ChatEvents = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: 'connected',
  // ? when user gets disconnected
  DISCONNECT_EVENT: 'disconnect',
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: 'newChat',
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: 'joinChat',
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: 'leaveChat',
  // ? when admin updates a group name
  UPDATE_GROUP_NAME_EVENT: 'updateGroupName',
  // ? when participant stops typing
  STOP_TYPING_EVENT: 'stopTyping',
  // ? when participant starts typing
  TYPING_EVENT: 'typing',
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: 'messageReceived',
  // ? when message is deleted
  MESSAGE_DELETE_EVENT: 'messageDeleted',
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: 'socketError',
});

const mountJoinChatEvent = (socket) => {
  socket.on(ChatEvents.JOIN_CHAT_EVENT, (chatId) => {
    logger.warn(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEvents.TYPING_EVENT, (chatId) => {
    socket.to(chatId).emit(ChatEvents.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEvents.STOP_TYPING_EVENT, (chatId) => {
    socket.to(chatId).emit(ChatEvents.STOP_TYPING_EVENT, chatId);
  });
};

export const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get('io').to(roomId).emit(event, payload);
};

export const initializeSocketIO = (io) => {
  return io.on('connection', async (socket) => {
    try {
      const token =
        // First try from cookies
        Object.fromEntries(
          (socket.handshake.headers?.cookie || '')
            .split(';')
            .map((c) => c.trim().split('=').map(decodeURIComponent))
        )?.accessToken ||
        // Then try from handshake auth
        socket.handshake.auth?.token;

      if (!token) throw new ApiError(401, 'Header token is missing');

      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // decode the token

      if (!decodedToken?._id)
        throw new ApiError(401, 'Invalid or expired token');

      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
      );

      if (!user) throw new ApiError(401, 'User not found');

      socket.user = user; // mount te user object to the socket
      socket.join(user._id.toString()); // user join yourself room with self notification used
      logger.warn('User connected 🗼:', user._id.toString());

      // socket.emit(ChatEvents.CONNECTED_EVENT,); // emit the connected event so that client is aware

      // Common events that needs to be mounted on the initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEvents.DISCONNECT_EVENT, () => {
        logger.warn('user disconnected 🚫' + socket.user?._id);
        socket.leave(socket.user?._id);
      });
    } catch (error) {
      logger.error(error?.message);
      socket.emit(ChatEvents.SOCKET_ERROR_EVENT, error?.message);
      socket.disconnect(true);
    }
  });
};
