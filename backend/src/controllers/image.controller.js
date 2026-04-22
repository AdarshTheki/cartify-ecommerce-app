import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { cloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Image } from '../models/image.model.js';

const imageUpload = asyncHandler(async (req, res) => {
  const file = req.file; // multer single file
  if (!file) throw new ApiError(403, 'Single image file is required!');

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'image',
  });

  const image = await Image.create({
    title: req.body.title || req.file.path,
    description: req.body.description,
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
    tags: req.body.tags || [],
    uploadedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, image, 'image upload success'));
});

const getImages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', sortBy, sortOrder } = req.query;

  const images = await Image.find({
    title: { $regex: search, $options: 'i' },
    isDeleted: false,
  })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  const totalDocs = await Image.countDocuments();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { page, limit, docs: images, totalDocs },
        'get images success'
      )
    );
});

const getImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image) throw new ApiError(404, 'image not found');

  res.status(200).json(new ApiResponse(200, image, 'get single image success'));
});

const updateImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  if (!new mongoose.Types.ObjectId(id)) {
    throw new ApiError(404, 'image id is required');
  }

  const image = await Image.findByIdAndUpdate(
    req.params.id,
    {
      title: title,
      description: description,
      tags: tags || [],
    },
    { new: true }
  );

  res.status(203).json(new ApiResponse(203, image, 'image update success'));
});

const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!new mongoose.Types.ObjectId(id))
    throw new ApiError(404, 'Image is not required!');

  const image = await Image.findById(id);
  if (!image) throw new ApiError(404, 'Image not found');

  await cloudinary.uploader.destroy(image.publicId);

  // soft delete in DB
  image.isDeleted = true;
  await image.save();

  res.status(204).json(new ApiResponse(204, image, 'image delete success'));
});

const bulkImageUpload = asyncHandler(async (req, res) => {
  const files = req.files;
  if (!files || files.images.length === 0)
    throw new ApiError(404, 'Not files uploaded images');

  const uploads = await Promise.all(
    files.images.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: 'image' })
    )
  );

  // Prepare DB data
  const imagesData = uploads.map((img, index) => ({
    title: req.body.title || `Image ${index + 1}`,
    url: img.secure_url,
    publicId: img.public_id,
    width: img.width,
    height: img.height,
    format: img.format,
    size: img.bytes,
    tags: req.body.tags || [],
    uploadedBy: req.user.id,
  }));

  const savedImages = await Image.insertMany(imagesData);

  res
    .status(201)
    .json(new ApiResponse(201, savedImages, 'bulk upload success'));
});

const bulkImageDelete = asyncHandler(async (req, res) => {
  const { imageIds } = req.body;
  if (!imageIds || imageIds.length === 0)
    throw new ApiError(404, 'No ids provides');

  const images = await Image.find({ _id: { $in: imageIds } });

  // deleting cloudinary images
  await Promise.all(
    images.map((img) => cloudinary.uploader.destroy(img.publicId))
  );

  // soft delete in DB
  await Image.updateMany({ _id: { $in: imageIds } }, { isDeleted: true });

  res
    .status(204)
    .json(
      new ApiResponse(
        204,
        { deleteCount: imageIds.length },
        'bulk delete successful'
      )
    );
});

// search by tags
// likes
// transformations

export {
  getImage,
  getImages,
  imageUpload,
  updateImage,
  deleteImage,
  bulkImageDelete,
  bulkImageUpload,
};
