import mongoose from 'mongoose';
import { Review } from '../models/review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all reviews by product ID
// @route   GET /api/v1/reviews/:productId
// @access  Public
export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const reviews = await Review.find({ productId })
    .populate('createdBy', 'fullName avatar')
    .sort({ createdAt: -1 });

  if (!reviews) {
    throw new ApiError(404, 'Product reviews not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, 'Reviews retrieved successfully'));
});

// @desc    Delete a review by review ID
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const createdBy = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, 'Invalid review ID');
  }

  const review = await Review.findOneAndDelete({ _id: reviewId, createdBy });

  if (!review) {
    throw new ApiError(404, 'Review not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, 'Review deleted successfully'));
});

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId, reviewText, rating } = req.body;
  const createdBy = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  if (!reviewText || !rating) {
    throw new ApiError(400, 'Review text and rating are required');
  }

  const newReview = await Review.create({
    productId,
    createdBy,
    reviewText,
    rating,
  });

  if (!newReview) {
    throw new ApiError(500, 'Review creation failed');
  }

  const review = await Review.findById(newReview._id).populate(
    'createdBy',
    'fullName avatar email'
  );

  return res
    .status(201)
    .json(new ApiResponse(201, review, 'Review added successfully'));
});

// @desc    Update an existing review
// @route   PUT /api/v1/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { reviewText, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, 'Invalid review ID');
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Update review
  const oldRating = review.rating;
  review.reviewText = reviewText || review.reviewText;
  review.rating = rating || review.rating;
  await review.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, review, 'Review updated successfully'));
});

// @desc    Like or unlike a review
// @route   POST /api/v1/reviews/:reviewId/like
// @access  Private
export const likeReview = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, 'Invalid review ID');
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (!review.likes.includes(createdBy.toString())) {
    review.likes.push(createdBy.toString());
  } else {
    review.likes = review.likes.filter(
      (id) => id.toString() !== createdBy.toString()
    );
  }

  await review.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: review.likes.length },
        `Review ${review.likes.includes(createdBy) ? 'liked' : 'unliked'}`
      )
    );
});
