import { isValidObjectId } from 'mongoose';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  uploadOnCloudinary,
  uploadManyOnCloudinary,
  deleteOnCloudinary,
  deleteManyOnCloudinary,
  extractPublicId,
} from '../utils/cloudinary.js';

const selectedProduct = {
  title: 1,
  category: 1,
  brand: 1,
  status: 1,
  thumbnail: 1,
  price: 1,
  rating: 1,
  stock: 1,
  discount: 1,
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
    sortBy = 'createdAt',
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

  const products = await Product.paginate(
    { ...query, isDeleted: false },
    options
  );

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
    ? await uploadOnCloudinary(req.files.thumbnail[0].path)
    : '';
  const images = req.files?.images
    ? await uploadManyOnCloudinary(req.files.images.map((file) => file.path))
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
      await deleteOnCloudinary(extractPublicId(product.thumbnail));
    }
    product.thumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);
  }

  if (req.files?.images) {
    if (product.images.length > 0) {
      await deleteManyOnCloudinary(product.images.map(extractPublicId));
    }
    product.images = await uploadManyOnCloudinary(
      req.files.images.map((file) => file.path)
    );
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

  const product = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true }
  );
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product deleted successfully'));
});

// @desc    Search products by title, category, or brand
// @route   GET /api/v1/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const regexQuery = {
    $or: [
      { title: { $regex: q, $options: 'i' } },
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

  const product = await Product.findById(productId).populate(
    'createdBy',
    'fullName email avatar'
  );

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product retrieved successfully'));
});

// @desc    Admin - Get all products with filters (including deleted)
// @route   GET /api/v1/admin/products
// @access  Admin
export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const {
    title = '',
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    sort = '-createdAt',
    page = 1,
    limit = 10,
    category,
    brand,
  } = req.query;

  const query = {};

  if (title) query.title = { $regex: title, $options: 'i' };
  if (category) query.category = category;
  if (brand) query.brand = brand;
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

  const products = await Product.paginate(query, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: { path: 'createdBy', select: 'fullName email avatar' },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products retrieved successfully'));
});

// @desc    Admin - Hard delete a product with destroying images
// @route   DELETE /api/v1/admin/products/:productId
// @access  Admin
export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await Product.findByIdAndDelete(productId, {
    isDeleted: true,
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.thumbnail) {
    await deleteOnCloudinary(extractPublicId(product.thumbnail));
  }

  if (product.images.length > 0) {
    await deleteManyOnCloudinary(product.images.map((i) => extractPublicId(i)));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Product deleted successfully'));
});
