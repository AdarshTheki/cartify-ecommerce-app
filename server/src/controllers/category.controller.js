import { isValidObjectId } from 'mongoose';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeSingleImg, uploadSingleImg } from '../utils/cloudinary.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'title',
    order = 'asc',
    title = '',
  } = req.query;

  const options = {
    page,
    limit,
    sort: { [sort]: order === 'asc' ? 1 : -1 },
    select: 'title status thumbnail createdBy',
  };

  const query = title ? { title: { $regex: title, $options: 'i' } } : {};

  const categories = await Category.paginate(query, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, 'Categories retrieved successfully')
    );
});

// @desc    Get category list
// @route   GET /api/v1/categories/list
// @access  Public
export const getCategoryList = asyncHandler(async (req, res) => {
  const categories = await Category.find().distinct('title');
  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, 'Category list retrieved successfully')
    );
});

// @desc    Get category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
  const filePath = req?.file?.path;
  const { title, status, description } = req.body;

  if (!title || !filePath || !status || !description) {
    throw new ApiError(400, 'All fields are required');
  }

  const thumbnail = await uploadSingleImg(filePath);
  if (!thumbnail) {
    throw new ApiError(500, 'Thumbnail upload failed');
  }

  const category = await Category.create({
    title,
    status,
    thumbnail,
    description,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const { title, status, description } = req.body;
  const filePath = req?.file?.path;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  let thumbnail;
  if (filePath) {
    thumbnail = await uploadSingleImg(filePath);
    await removeSingleImg(category.thumbnail);
    if (!thumbnail) {
      throw new ApiError(500, 'Thumbnail upload failed');
    }
  }

  category.title = title || category.title;
  category.status = status || category.status;
  category.description = description || category.description;
  category.thumbnail = thumbnail || category.thumbnail;

  await category.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, category, 'Category updated successfully'));
});

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (category.thumbnail) {
    await removeSingleImg(category.thumbnail);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, 'Category deleted successfully'));
});
