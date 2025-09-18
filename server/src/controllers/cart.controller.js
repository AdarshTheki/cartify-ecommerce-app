import mongoose, { isValidObjectId } from 'mongoose';
import { Cart } from '../models/cart.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const selectedProduct = {
  _id: 1,
  title: 1,
  category: 1,
  brand: 1,
  status: 1,
  thumbnail: 1,
  price: 1,
  rating: 1,
};

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;

  const cart = await Cart.findOne({ createdBy }).populate({
    path: 'items.productId',
    select: Object.keys(selectedProduct).join(' '),
  });

  if (!cart || cart.items.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, 'Cart retrieved successfully'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { productId, quantity } = req.body;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  let cart = await Cart.findOne({ createdBy });

  if (!cart) {
    cart = new Cart({ createdBy, items: [{ productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();

  return res
    .status(201)
    .json(new ApiResponse(201, cart, 'Item added to cart successfully'));
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:id
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const cart = await Cart.findOne({ createdBy });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== id);

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Item removed from cart successfully'));
});

// @desc    Update item quantity in cart
// @route   PUT /api/v1/cart
// @access  Private
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;
  const { quantity, productId } = req.body;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const cart = await Cart.findOne({ createdBy });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, cart, 'Cart item quantity updated successfully')
      );
  } else {
    throw new ApiError(404, 'Item not found in cart');
  }
});

// @desc    Clear user's cart
// @route   DELETE /api/v1/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const createdBy = req?.user?._id;

  const cart = await Cart.findOneAndDelete({ createdBy });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Cart cleared successfully'));
});
