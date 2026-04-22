import { asyncHandler } from '../utils/asyncHandler.js';

export const cloudinaryMiddleware = asyncHandler((req, res, next) => {
  const { cloud_name, api_key, api_secret } = req.body;

  const missing = [];
  if (!cloud_name) missing.push('cloud_name');
  if (!api_key) missing.push('api_key');
  if (!api_secret) missing.push('api_secret');

  if (missing.length) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Cloudinary configuration error — missing variable(s): ${missing.join(', ')}`,
    });
  }

  next();
});
