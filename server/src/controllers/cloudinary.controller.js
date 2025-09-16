import fs from 'fs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { extractPublicId, cloudinary, folder } from '../utils/cloudinary.js';
import { AIModel } from '../models/ai.model.js';

// @desc    Apply Cloudinary image effect
// @route   POST /api/v1/openai/image-effect
// @access  Private
export const imageEffect = asyncHandler(async (req, res) => {
  const { transformations } = req.body;
  const imagePath = req.file?.path;

  if (!imagePath) {
    throw new ApiError(400, 'Image file is required');
  }

  if (!transformations) {
    throw new ApiError(400, 'Transformations are required');
  }

  // 1. Upload the image to Cloudinary
  let uploadResult;

  try {
    uploadResult = await cloudinary.uploader.upload(imagePath, {
      resource_type: 'image',
      folder,
    });
    fs.unlinkSync(imagePath);
  } catch (error) {
    fs.unlinkSync(imagePath);
    throw new Error(error.message);
  }
  // 2. Parse the transformations
  const transformationList = JSON.parse(transformations);

  if (!Array.isArray(transformationList)) {
    throw new ApiError(400, 'Transformations should be an array');
  }

  // 3. Generate transformed image URLs
  const transformedImages = transformationList.map((transformation) => {
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [transformation], // Apply a single transformation
    });

    // Extract transformation name for the response
    const transformationName = Object.entries(transformation)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return {
      secure_url: transformedUrl,
      transformation: transformationName,
    };
  });

  const newAiModel = await AIModel({
    createdBy: req.user._id,
    prompt: transformedImages.map((i) => i.transformation)[0],
    response: transformedImages.map((i) => i.secure_url)[0],
    isPublic: true,
    model: 'text-to-image',
  });

  // 4. Respond with the array of transformed images
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newAiModel,
        'Image transformations applied successfully'
      )
    );
});

// @desc    Remove background from an image
// @route   POST /api/v1/cloudinary/remove-background
// @access  Private
export const removeBackground = asyncHandler(async (req, res) => {
  const imagePath = req.file?.path;
  if (!imagePath) {
    throw new ApiError(400, 'Image file is required');
  }
  let result;
  try {
    result = await cloudinary.uploader.upload(imagePath, {
      effect: 'background_removal',
      resource_type: 'image',
      folder,
    });
    fs.unlinkSync(imagePath);
  } catch (error) {
    fs.unlinkSync(imagePath);
    throw new Error(error.message);
  }

  const newAiModel = await AIModel({
    createdBy: req.user._id,
    prompt: 'remove background image',
    response: result.secure_url,
    isPublic: true,
    model: 'text-to-image',
  });

  res
    .status(200)
    .json(new ApiResponse(200, newAiModel, 'Background removed successfully'));
});

// @desc    Remove object from an image
// @route   POST /api/v1/cloudinary/remove-object
// @access  Private
export const removeObject = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const imagePath = req.file?.path;

  if (!imagePath) {
    throw new ApiError(400, 'Image file is required');
  }
  if (!prompt) {
    throw new ApiError(400, 'Prompt is required to describe the object');
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(imagePath, {
      transformation: { effect: `gen_remove:${new URLSearchParams(prompt)}` },
      resource_type: 'image',
      folder,
    });
    fs.unlinkSync(imagePath);
  } catch (error) {
    fs.unlinkSync(imagePath);
    throw new Error(error.message);
  }

  const newAiModel = await AIModel({
    createdBy: req.user._id,
    prompt: prompt,
    response: result.secure_url,
    isPublic: true,
    model: 'text-to-image',
  });

  res
    .status(200)
    .json(new ApiResponse(200, newAiModel, 'Object removed successfully'));
});

export const getAllImages = asyncHandler(async (req, res) => {
  const expression = req.query?.expression || 'resource_type:image';
  const order = req.query?.order || 'desc';
  const sort = req.query?.sort || 'created_at';
  const limit = +req.query?.limit || 10;

  const result = await cloudinary.search
    .expression(expression)
    .sort_by(sort, order)
    .max_results(limit)
    .execute();

  const data = result?.resources || [];

  res
    .status(200)
    .json(new ApiResponse(200, data, 'Cloudinary data retrieve successfully'));
});

export const removeCloudinaryFile = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    throw new ApiError(400, 'ImageUrl is required!');
  }

  const publicId = extractPublicId(imageUrl);

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });

  res.status(200).json(new ApiResponse(200, result, 'Delete Image Success'));
});

export const uploadCloudinaryFile = asyncHandler(async (req, res) => {
  const { folder: folderPath } = req.body; // optional folder name
  const imagePath = req?.file?.path;

  if (!imagePath) throw new ApiError(404, 'Image filepath is Invalid');

  let result;
  try {
    result = await cloudinary.uploader.upload(imagePath, {
      folder: folderPath || folder,
    });
    fs.unlinkSync(imagePath);
  } catch (error) {
    fs.unlinkSync(imagePath);
    throw new Error(error.message);
  }
  res.status(200).json(new ApiResponse(200, result, 'Upload Image Success'));
});
