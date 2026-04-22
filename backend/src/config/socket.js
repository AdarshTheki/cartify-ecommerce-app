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
    logger.info(`User joined the chat 🤝. chatId: `, chatId);
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
  const onlineUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      logger.info('Socket authentication started 🔐', token);

      if (!token) throw new ApiError(404, 'Token missing');

      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

      const user = await User.findById(decoded._id);

      if (!user) throw new ApiError(404, 'User not found');

      socket.user = user;
      next();
    } catch (error) {
      socket.emit(ChatEvents.SOCKET_ERROR_EVENT, {
        message: error?.message || 'Unauthorized',
      });
      next(new ApiError(401, error?.message || 'Unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.user; // get the user object from the socket
    socket.join(user._id.toString()); // user join yourself room with self notification used
    logger.info('User connected 🗼:', user._id.toString());

    // socket.emit(ChatEvents.CONNECTED_EVENT); // emit the connected event so that client is aware

    onlineUsers.set(user._id.toString(), socket.id); // add the user to the online users map

    io.emit('onlineUsers', Array.from(onlineUsers.keys())); // emit the online users to all clients

    // Common events that needs to be mounted on the initialization
    mountJoinChatEvent(socket);
    mountParticipantTypingEvent(socket);
    mountParticipantStoppedTypingEvent(socket);

    socket.on('disconnect', () => {
      logger.info('user disconnected 🚫' + socket.user?._id);
      onlineUsers.delete(user._id.toString()); // remove the user from the online users map
      io.emit('onlineUsers', Array.from(onlineUsers.keys())); // emit the updated online users to all clients
    });
  });
};
