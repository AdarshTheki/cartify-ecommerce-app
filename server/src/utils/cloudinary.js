import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { logger } from '../middlewares/logger.middleware.js';

// Configs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const folder = 'cartify';

// Upload Single Image
const uploadSingleImg = async (localFilePath = '') => {
  if (!localFilePath) return false;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    logger.error('Upload Error:', error.message);
    return false;
  } finally {
    fs.unlinkSync(localFilePath); // Clean temp file
  }
};

// Upload Multiple Images
const uploadMultiImg = async (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return [];
  const tempFiles = images.map((img) => img.path);

  try {
    const uploadResults = await Promise.allSettled(
      images.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: folder,
        })
      )
    );

    const urls = uploadResults
      .filter((res) => res.status === 'fulfilled')
      .map((res) => res.value.secure_url);

    return urls;
  } catch (error) {
    logger.error('Upload Error:', error); // log full error
    return [];
  } finally {
    await Promise.all(
      tempFiles.map((file) => {
        fs.unlinkSync(file);
      })
    );
  }
};

// Delete Single Image
const removeSingleImg = async (url = '') => {
  if (!url) return false;

  try {
    const publicId = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') return true;

    logger.error(result.result);
    return false;
  } catch (error) {
    logger.error('Delete Error:', error.message);
    return false;
  }
};

// Delete Multiple Images
const removeMultiImg = async (imageUrls = []) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return false;

  try {
    const publicIds = imageUrls.map((url) => extractPublicId(url));

    const results = await Promise.allSettled(
      publicIds.map((id) => cloudinary.uploader.destroy(id))
    );

    const hasFailures = results.some(
      (r) => r.status === 'rejected' || r.value?.result !== 'ok'
    );

    return !hasFailures;
  } catch (error) {
    logger.error(error.message);
    return false;
  }
};

// Extract Cloudinary Public ID from URL
const extractPublicId = (url = '') => {
  // Expected format: https://res.cloudinary.com/xxx/image/upload/v12345678/folder/filename.jpg
  const parts = url.split('/');
  const filename = parts.pop()?.split('.')[0];
  const folderName =
    parts.slice(-1)[0] === folder ? folder : parts.slice(-2).join('/');

  return `${folderName}/${filename}`;
};

export {
  cloudinary,
  uploadSingleImg,
  uploadMultiImg,
  removeSingleImg,
  removeMultiImg,
  extractPublicId,
};
