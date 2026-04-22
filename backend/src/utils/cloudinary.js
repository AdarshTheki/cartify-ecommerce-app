import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { logger } from '../middlewares/logger.middleware.js';

// Configs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const folder = 'cartify';

// remove temp file after upload or delete
const removeTempFile = (localPath = '') => {
  try {
    if (localPath && fs.existsSync(localPath)) fs.unlinkSync(localPath);
  } catch (_) {}
};

// Upload Single Image
const uploadOnCloudinary = async (
  localFilePath = '',
  folderName = 'cartify',
  options = {}
) => {
  if (!localFilePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: folderName,
      ...options,
    });
    removeTempFile(localFilePath);
    return result.secure_url;
  } catch (error) {
    removeTempFile(localFilePath);
    logger.error('[Cloudinary] Upload Error:', error.message);
    return null;
  }
};

const uploadBase64OnCloudinary = async (
  dataUri,
  folderName = 'cartify',
  options = {}
) => {
  if (!dataUri) return null;

  try {
    return await cloudinary.uploader.upload(dataUri, {
      resource_type: 'auto',
      folder: folderName,
      ...options,
    });
  } catch (error) {
    logger.error('[Cloudinary] base64 upload error:', error.message);
    return null;
  }
};

const uploadStreamOnCloudinary = async (
  readableStream,
  folderName = 'cartify',
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: folderName, ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    readableStream.pipe(uploadStream);
  });
};

const uploadManyOnCloudinary = async (
  localPaths = [],
  folderName = 'cartify',
  options = {}
) => {
  return Promise.all(
    localPaths.map((p) => uploadOnCloudinary(p, folderName, options))
  );
};

const deleteOnCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] destroy error:', error.message);
    return null;
  }
};

const deleteManyOnCloudinary = async (
  publicIds = [],
  resourceType = 'image'
) => {
  if (!publicIds.length) return null;

  try {
    return await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] bulk-destroy error:', error.message);
    return null;
  }
};

const getCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;

  try {
    return await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] get-asset error:', error.message);
    return null;
  }
};

const searchCloudinaryAssets = async (expression, opts = {}) => {
  try {
    let query = cloudinary.search.expression(expression);
    if (opts.max_results) query = query.max_results(opts.max_results);
    if (opts.next_cursor) query = query.next_cursor(opts.next_cursor);
    if (opts.sort_by) query = query.sort_by(...opts.sort_by);
    if (opts.with_field)
      opts.with_field.forEach((f) => (query = query.with_field(f)));
    return await query.execute();
  } catch (error) {
    logger.error('[Cloudinary] search error:', error.message);
    return null;
  }
};
const renameOnCloudinary = async (
  fromPublicId,
  toPublicId,
  resourceType = 'image'
) => {
  if (!fromPublicId || !toPublicId) return null;

  try {
    return await cloudinary.uploader.rename(fromPublicId, toPublicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] rename error:', error.message);
    return null;
  }
};

const addTagsOnCloudinary = async (publicIds, tags, resourceType = 'image') => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  const tgs = Array.isArray(tags) ? tags : [tags];
  if (!ids.length || !tgs.length) return null;

  try {
    return await cloudinary.uploader.add_tag(tgs.join(','), ids, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] add-tags error:', error.message);
    return null;
  }
};

const removeTagsOnCloudinary = async (
  publicIds,
  tags,
  resourceType = 'image'
) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  const tgs = Array.isArray(tags) ? tags : [tags];
  if (!ids.length || !tgs.length) return null;

  try {
    return await cloudinary.uploader.remove_tag(tgs.join(','), ids, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error('[Cloudinary] remove-tags error:', error.message);
    return null;
  }
};

const getTransformedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
};

const getThumbnailUrl = (publicId, size = 200) =>
  getTransformedUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto',
  });

const getSignedUrl = (publicId, expiresInSeconds = 3600) => {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.utils.private_download_url(publicId, '', {
    expires_at: expiresAt,
  });
};

// Extract Cloudinary Public ID from URL
const extractPublicId = (url = '') => {
  const afterUpload = url.split('/upload/')[1] || '';
  return afterUpload
    .replace(/^v\d+\//, '') // strip version prefix  vXXXXXXXXX/
    .replace(/\.[^/.]+$/, ''); // strip file extension
};

const isCloudinaryUrl = (url = '') =>
  /^https?:\/\/res\.cloudinary\.com\//.test(url);

export {
  // Upload
  uploadOnCloudinary,
  uploadBase64OnCloudinary,
  uploadStreamOnCloudinary,
  uploadManyOnCloudinary,

  // Destroy / Delete
  deleteOnCloudinary,
  deleteManyOnCloudinary,

  // Read / Info
  getCloudinaryAsset,
  searchCloudinaryAssets,

  // Update / Transform
  renameOnCloudinary,
  addTagsOnCloudinary,
  removeTagsOnCloudinary,

  // URL Generation
  getTransformedUrl,
  getThumbnailUrl,
  getSignedUrl,

  // Helpers
  extractPublicId,
  isCloudinaryUrl,

  // cloudinary instance
  cloudinary,
};
