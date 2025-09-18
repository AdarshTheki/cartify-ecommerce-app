import { isValidObjectId } from 'mongoose';
import { Brand } from '../models/brand.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeSingleImg, uploadSingleImg } from '../utils/cloudinary.js';

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getAllBrands = asyncHandler(async (req, res) => {
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

  const brands = await Brand.paginate(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, brands, 'Brands retrieved successfully'));
});

// @desc    Get brand list
// @route   GET /api/v1/brands/list
// @access  Public
export const getBrandList = asyncHandler(async (req, res) => {
  const brands = await Brand.find().distinct('title');
  return res
    .status(200)
    .json(new ApiResponse(200, brands, 'Brand list retrieved successfully'));
});

// @desc    Get brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid brand ID');
  }

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, brand, 'Brand retrieved successfully'));
});

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Admin
export const createBrand = asyncHandler(async (req, res) => {
  const filePath = req?.file?.path;
  const { title, status, description } = req.body;

  if (!title || !filePath || !status || !description) {
    throw new ApiError(400, 'All fields are required');
  }

  const thumbnail = await uploadSingleImg(filePath);
  if (!thumbnail) {
    throw new ApiError(500, 'Thumbnail upload failed');
  }

  const brand = await Brand.create({
    title,
    status,
    thumbnail,
    description,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, brand, 'Brand created successfully'));
});

// @desc    Update a brand
// @route   PUT /api/v1/brands/:id
// @access  Admin
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid brand ID');
  }

  const { title, status, description } = req.body;
  const filePath = req?.file?.path;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }

  let thumbnail;
  if (filePath) {
    await removeSingleImg(brand.thumbnail);
    thumbnail = await uploadSingleImg(filePath);
    if (!thumbnail) {
      throw new ApiError(500, 'Thumbnail upload failed');
    }
  }

  brand.title = title || brand.title;
  brand.status = status || brand.status;
  brand.description = description || brand.description;
  brand.thumbnail = thumbnail || brand.thumbnail;

  await brand.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, brand, 'Brand updated successfully'));
});

// @desc    Delete a brand
// @route   DELETE /api/v1/brands/:id
// @access  Admin
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid brand ID');
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }

  if (brand.thumbnail) {
    await removeSingleImg(brand.thumbnail);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, brand, 'Brand deleted successfully'));
});
