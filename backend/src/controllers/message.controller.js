import mongoose, { isValidObjectId } from 'mongoose';
import { Chat } from '../models/chat.model.js';
import { Message } from '../models/message.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeMultiImg, uploadMultiImg } from '../utils/cloudinary.js';
import { ChatEvents, emitSocketEvent } from '../config/socket.js';

// @desc    Get messages by chat ID
// @route   GET /api/v1/messages/:chatId
// @access  Private
export const getMessagesByChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, 'Invalid chat ID');
  }

  const messages = await Message.find({
    chat: new mongoose.Types.ObjectId(chatId),
  })
    .populate('sender', 'fullName avatar email')
    .sort({ updatedAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, 'Messages retrieved successfully'));
});

// @desc    Create a new message
// @route   POST /api/v1/messages/:chatId
// @access  Private
export const createMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { chatId } = req.params;
  const { attachments } = req.files;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, 'Invalid chat ID');
  }

  if (!content && !Array.isArray(attachments)) {
    throw new ApiError(400, 'Content or attachments are required');
  }

  let uploadedAttachments = [];
  if (Array.isArray(attachments) && attachments.length > 0) {
    uploadedAttachments = await uploadMultiImg(attachments);
    if (!uploadedAttachments?.length) {
      throw new ApiError(500, 'Attachment upload failed');
    }
  }

  const newMessage = await Message.create({
    chat: new mongoose.Types.ObjectId(chatId),
    sender: req.user._id,
    content: content || '',
    attachments: uploadedAttachments,
  });

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { lastMessage: newMessage._id },
    { new: true }
  );

  const populatedMessage = await newMessage.populate(
    'sender',
    'fullName avatar email'
  );

  chat.participants.forEach((userId) => {
    emitSocketEvent(
      req,
      userId.toString(),
      ChatEvents.MESSAGE_RECEIVED_EVENT,
      populatedMessage
    );
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedMessage, 'Message created successfully')
    );
});

// @desc    Delete a message
// @route   DELETE /api/v1/messages/:messageId
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  if (!isValidObjectId(messageId)) {
    throw new ApiError(400, 'Invalid message ID');
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  if (message.attachments && message.attachments.length > 0) {
    await removeMultiImg(message.attachments);
  }

  await Message.findByIdAndDelete(messageId);

  const chat = await Chat.findById(message.chat).populate('lastMessage');

  chat.participants.forEach((p) => {
    emitSocketEvent(
      req,
      chat._id.toString(),
      ChatEvents.MESSAGE_DELETE_EVENT,
      message
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, 'Message deleted successfully'));
});
