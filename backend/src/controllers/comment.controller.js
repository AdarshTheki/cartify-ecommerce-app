import mongoose from 'mongoose';
import { Comment } from '../models/comment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all comments by product ID
// @route   GET /api/v1/comments/:productId
// @access  Public
export const getCommentsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const comments = await Comment.find({ productId })
    .populate('createdBy', 'fullName avatar')
    .populate('replies.createdBy', 'fullName avatar')
    .populate('reports.createdBy', 'fullName avatar')
    .sort({ createdAt: -1 });

  if (!comments) {
    throw new ApiError(404, 'Product comments not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

// @desc    Delete a comment by comment ID
// @route   DELETE /api/v1/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const createdBy = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID');
  }

  const comment = await Comment.findOneAndDelete({ _id: commentId, createdBy });

  if (!comment) {
    throw new ApiError(404, 'Comment not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment deleted successfully'));
});

// @desc    Create a new comment
// @route   POST /api/v1/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { productId, text } = req.body;
  const createdBy = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  if (!text) {
    throw new ApiError(400, 'Comment text is required');
  }

  const newComment = await Comment.create({
    productId,
    createdBy,
    text,
  });

  if (!newComment) {
    throw new ApiError(500, 'Comment creation failed');
  }

  const comment = await Comment.findById(newComment._id)
    .populate('createdBy', 'fullName avatar email')
    .populate('replies.createdBy', 'fullName avatar email')
    .populate('reports.createdBy', 'fullName avatar email');

  return res
    .status(201)
    .json(new ApiResponse(201, comment, 'Comment added successfully'));
});

// @desc    Update an existing comment
// @route   PUT /api/v1/comments/:commentId
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  comment.text = text || comment.text;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment updated successfully'));
});

// @desc    Like or unlike a comment
// @route   POST /api/v1/comments/:commentId/like
// @access  Private
export const likeComment = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!comment.likes.includes(createdBy.toString())) {
    comment.likes.push(createdBy.toString());
  } else {
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== createdBy.toString()
    );
  }

  await comment.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: comment.likes.length },
        `Comment ${comment.likes.includes(createdBy) ? 'liked' : 'unliked'}`
      )
    );
});

// @desc    Reply to a comment
// @route   POST /api/v1/comments/:commentId/reply
// @access  Private
export const replyToComment = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID');
  }

  if (!text) {
    throw new ApiError(400, 'Reply text is required');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  comment.replies.push({ createdBy, text });
  await comment.save();

  const commentPopulated = await Comment.findById(commentId)
    .populate('createdBy', 'fullName avatar email')
    .populate('replies.createdBy', 'fullName avatar email')
    .populate('reports.createdBy', 'fullName avatar email');

  return res
    .status(201)
    .json(new ApiResponse(201, commentPopulated, 'Reply added successfully'));
});

// @desc    Report a comment
// @route   POST /api/v1/comments/:commentId/report
// @access  Private
export const reportComment = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { commentId } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID');
  }

  if (!reason) {
    throw new ApiError(400, 'Reason is required');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  comment.reports.push({ createdBy, reason });
  await comment.save();

  const commentPopulated = await Comment.findById(commentId)
    .populate('createdBy', 'fullName avatar email')
    .populate('replies.createdBy', 'fullName avatar email')
    .populate('reports.createdBy', 'fullName avatar email');

  return res
    .status(201)
    .json(
      new ApiResponse(201, commentPopulated, 'Comment reported successfully')
    );
});
