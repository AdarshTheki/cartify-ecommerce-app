import { isValidObjectId } from 'mongoose';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  removeMultiImg,
  removeSingleImg,
  uploadMultiImg,
  uploadSingleImg,
} from '../utils/cloudinary.js';

const selectedProduct = {
  title: 1,
  category: 1,
  brand: 1,
  status: 1,
  thumbnail: 1,
  price: 1,
  rating: 1,
};

// @desc    Get all products with filters
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    title = '',
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    sortBy = 'title',
    order = 'asc',
    page = 1,
    limit = 10,
    category,
    brand,
  } = req.query;

  const query = {};

  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }
  if (brand) {
    query.brand = brand;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minRating || maxRating) {
    query.rating = {};
    if (minRating) query.rating.$gte = Number(minRating);
    if (maxRating) query.rating.$lte = Number(maxRating);
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: order === 'asc' ? 1 : -1 },
    select: Object.keys(selectedProduct).join(' '),
  };

  const products = await Product.paginate(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products retrieved successfully'));
});

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    brand,
    description,
    price,
    rating,
    stock,
    discount,
  } = req.body;

  if (
    !title ||
    !category ||
    !brand ||
    !description ||
    !price ||
    !rating ||
    !stock ||
    !discount
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const thumbnail = req.files?.thumbnail
    ? await uploadSingleImg(req.files.thumbnail[0].path)
    : '';
  const images = req.files?.images
    ? await uploadMultiImg(req.files.images)
    : [];

  const product = await Product.create({
    title,
    category,
    brand,
    thumbnail,
    images,
    description,
    price,
    rating,
    stock,
    discount,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const {
    title,
    category,
    brand,
    description,
    price,
    rating,
    stock,
    discount,
    status,
  } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (req.files?.thumbnail) {
    if (product.thumbnail) {
      await removeSingleImg(product.thumbnail);
    }
    product.thumbnail = await uploadSingleImg(req.files.thumbnail[0].path);
  }

  if (req.files?.images) {
    if (product.images.length > 0) {
      await removeMultiImg(product.images);
    }
    product.images = await uploadMultiImg(req.files.images);
  }

  product.title = title || product.title;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.price = price || product.price;
  product.rating = rating || product.rating;
  product.stock = stock || product.stock;
  product.discount = discount || product.discount;
  product.status = status || product.status;

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.thumbnail) {
    await removeSingleImg(product.thumbnail);
  }
  if (product.images.length > 0) {
    await removeMultiImg(product.images);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product deleted successfully'));
});

// @desc    Get products filtered by category or brand
// @route   GET /api/v1/products/filter/:query/:name
// @access  Public
export const getProductsByFilter = asyncHandler(async (req, res) => {
  const { name, query } = req.params;
  if (!name || !query) {
    throw new ApiError(400, 'Please provide name and query');
  }

  const regex = new RegExp(name, 'i');

  let products;
  if (query === 'category') {
    products = await Product.find({ category: regex });
  } else if (query === 'brand') {
    products = await Product.find({ brand: regex });
  } else {
    throw new ApiError(
      400,
      "Invalid filter query. Must be 'category' or 'brand'"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products filtered successfully'));
});

// @desc    Search products by title, category, or brand
// @route   GET /api/v1/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], 'Products searched successfully'));
  }

  const regexQuery = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ],
  };

  const products = await Product.find(regexQuery)
    .select(selectedProduct)
    .limit(10);

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products searched successfully'));
});

// @desc    Get single product by ID
// @route   GET /api/v1/products/:productId
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product retrieved successfully'));
});
