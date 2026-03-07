import { isValidObjectId } from 'mongoose';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeSingleImg } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ChatEvents, emitSocketEvent } from '../config/socket.js';

// ----delete chat message----
const deleteChatMessages = async (chatId) => {
  const messages = await Message.find({ chat: chatId });

  if (messages.length) {
    messages.map(async (message) => {
      // remove attachment files
      if (message.attachments?.length) {
        message.attachments.forEach(async (url) => await removeSingleImg(url));
      }
    });

    // delete all the messages
    await Message.deleteMany({ chat: chatId });
  }
};

// -----create or get one one one chat----
export const createOrGetChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;

  const receiver = await User.findById(receiverId);
  if (!receiver) throw new ApiError(404, 'User is does not exits');

  // check if receiver is not the user who is requesting a chat
  if (receiverId.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot chat with yourself');
  }

  // Search for an existing one-on-one chat between the two users (order-independent)
  let chat = await Chat.findOne({
    isGroupChat: false,
    participants: { $all: [req.user._id, receiverId], $size: 2 },
  })
    .populate('participants', 'fullName avatar email')
    .populate('lastMessage');

  if (chat) {
    return res
      .status(200)
      .json({ chat, message: 'chat retrieved successfully' });
  }

  // If chat doesn't exist, create a new one
  const newChat = await Chat.create({
    isGroupChat: false,
    name: receiver?.fullName || 'one on one chat',
    participants: [req.user._id, receiverId],
    admin: req.user._id,
  });

  const populatedChat = await newChat.populate(
    'participants',
    'fullName avatar email'
  );

  populatedChat.participants.forEach((p) => {
    // if (p._id.toString() === req.user._id.toString()) return; // don't emit the event for the logged
    emitSocketEvent(
      req,
      p._id?.toString(),
      ChatEvents.NEW_CHAT_EVENT,
      populatedChat
    );
  });

  res.status(201).json({
    chat: populatedChat,
    message: 'get or create chat room in one on one',
  });
});

// ----search available users-----
export const searchUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        $nor: [{ _id: req.user._id }, { role: 'admin' }],
      },
    },
    { $project: { avatar: 1, fullName: 1, email: 1 } },
    { $limit: 10 },
  ]);
  res.status(200).json(users);
});

// ----list of all chats or group-----
export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'fullName avatar email')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, chats, 'chats retrieved successfully'));
});

// ----delete one on one chat with message deleted all----
export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) throw new ApiError(404, 'Invalid chat ID');

  const chat = await Chat.findById(chatId);

  if (!chat) throw new ApiError(404, 'chat not found on db');

  const otherParticipate = chat.participants.find(
    (p) => p._id.toString() !== req.user._id.toString()
  );

  if (!otherParticipate) throw new ApiError(404, 'Other participant not found');

  await Chat.findByIdAndDelete(chatId);
  await deleteChatMessages(chatId);

  emitSocketEvent(req, chatId, ChatEvents.LEAVE_CHAT_EVENT, chat);

  res
    .status(200)
    .json({ chat, message: 'chat and all message deleted successfully' });
});

// ----create a group chat----
export const createGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;

  if (participants.includes(req.user._id.toString()))
    throw new ApiError(
      400,
      'Participants array should not be contain the group creator'
    );

  let members = [...new Set([...participants, req.user._id.toString()])];

  if (members.length < 3)
    throw new ApiError(400, 'You have passed duplicate participants Ids');

  // create a group chat
  const groupChat = await Chat.create({
    name,
    admin: req.user._id,
    isGroupChat: true,
    participants: members,
  });

  const chat = await Chat.findById(groupChat._id)
    .populate('participants', 'fullName avatar email')
    .populate('lastMessage');

  if (!chat) throw new ApiError(500, 'Internal server error');

  chat.participants.forEach((p) => {
    // if (p._id.toString() === req.user._id.toString()) return;
    emitSocketEvent(req, p._id.toString(), ChatEvents.NEW_CHAT_EVENT, chat);
  });

  res.status(201).json({ chat, message: 'Group chat created successfully' });
});

// ----get group chat in details----
export const getGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.findById(chatId)
    .populate('participants', 'fullName avatar email')
    .populate('lastMessage');

  return res.status(200).json(groupChat);
});

// ----update group chat----
export const updateGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (chat.admin.toString() !== req.user._id.toString())
    throw new ApiError(404, 'You are not a admin this group chat');

  chat.name = name || chat.name;
  chat.participants = [...new Set(participants, req.user._id.toString())];

  await chat.save();

  const populatedChat = await Chat.findOne({
    isGroupChat: true,
    _id: chat._id,
  })
    .populate('participants', 'fullName avatar email')
    .populate('lastMessage');

  populatedChat.participants.forEach((p) => {
    if (p._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      populatedChat._id.toString(),
      ChatEvents.UPDATE_GROUP_NAME_EVENT,
      populatedChat
    );
  });

  res
    .status(200)
    .json({ populatedChat, message: 'Group chat updated successfully' });
});
