import { Address } from '../models/address.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get address by params
// @route   GET /api/v1/address/:id
// @access  Private
export const getAddress = asyncHandler(async (req, res) => {
  const addresses = await Address.findById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, 'Address retrieved successfully'));
});

// @desc    Get all addresses for a user
// @route   GET /api/v1/addresses
// @access  Private
export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, 'Addresses retrieved successfully'));
});

// @desc    Create a new address
// @route   POST /api/v1/addresses
// @access  Private
export const createAddress = asyncHandler(async (req, res) => {
  const {
    isDefault,
    addressLine1,
    city,
    landmark,
    postalCode,
    country,
    phoneNumber,
    title,
    addressLine2 = '',
  } = req.body;

  if (
    [
      addressLine1,
      city,
      landmark,
      postalCode,
      country,
      phoneNumber,
      title,
    ].some((field) => !field)
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const newAddress = await Address.create({
    isDefault: isDefault || false,
    addressLine1,
    city,
    landmark,
    postalCode,
    country,
    phoneNumber,
    title,
    addressLine2,
    userId: req.user._id,
  });

  if (isDefault) {
    await Address.updateMany(
      { userId: req.user._id, _id: { $ne: newAddress._id } },
      { $set: { isDefault: false } }
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newAddress, 'Address created successfully'));
});

// @desc    Update an address
// @route   PUT /api/v1/addresses/:id
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const {
    isDefault,
    addressLine1,
    city,
    landmark,
    postalCode,
    country,
    phoneNumber,
    title,
    addressLine2 = '',
  } = req.body;

  const address = await Address.findOne({
    _id: addressId,
    userId: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  address.addressLine1 = addressLine1 || address.addressLine1;
  address.city = city || address.city;
  address.landmark = landmark || address.landmark;
  address.postalCode = postalCode || address.postalCode;
  address.country = country || address.country;
  address.phoneNumber = phoneNumber || address.phoneNumber;
  address.title = title || address.title;
  address.addressLine2 = addressLine2 || address.addressLine2;

  if (isDefault !== undefined) {
    address.isDefault = isDefault;
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user._id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }
  }

  await address.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Address updated successfully'));
});

// @desc    Delete an address
// @route   DELETE /api/v1/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    userId: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Address deleted successfully'));
});
