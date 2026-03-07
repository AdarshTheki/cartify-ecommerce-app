import { Address } from '../models/address.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all addresses for a user
// @route   GET /api/v1/addresses
// @access  Private
export const getAllAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ createdBy: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, 'Addresses retrieved successfully'));
});

// @desc    Create a new address
// @route   POST /api/v1/addresses
// @access  Private
export const createAddress = asyncHandler(async (req, res) => {
  const { addressLine, isDefault, city, postalCode, countryCode } = req.body;
  const createdBy = req.user._id;

  if ([addressLine, city, postalCode, countryCode].some((field) => !field)) {
    throw new ApiError(400, 'All fields are required');
  }

  if (
    typeof parseInt(postalCode) !== 'number' ||
    postalCode < 100000 ||
    postalCode > 999999
  ) {
    throw new ApiError(400, 'Invalid postal code');
  }

  const newAddress = await Address.create({
    createdBy,
    addressLine,
    isDefault: isDefault || false,
    city,
    postalCode: parseInt(postalCode),
    countryCode,
  });

  if (isDefault) {
    await Address.updateMany(
      { createdBy, _id: { $ne: newAddress._id } },
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
  const { addressLine, isDefault, city, postalCode, countryCode } = req.body;

  const address = await Address.findOne({
    _id: addressId,
    createdBy: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  address.addressLine = addressLine || address.addressLine;
  address.city = city || address.city;
  address.postalCode = postalCode || address.postalCode;
  address.countryCode = countryCode || address.countryCode;

  if (isDefault !== undefined) {
    address.isDefault = isDefault;
    if (isDefault) {
      await Address.updateMany(
        { createdBy: req.user._id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }
  }

  await address.save();

  return res
    .status(200)
    .json(new ApiResponse(200, address, 'Address updated successfully'));
});

// @desc    Delete an address
// @route   DELETE /api/v1/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    createdBy: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, 'Address deleted successfully'));
});
