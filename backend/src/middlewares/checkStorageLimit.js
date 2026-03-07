import { User } from '../models/user.model.js';

export const checkStorageLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate file size for upload
    let uploadSize = 0;

    if (req.file) {
      uploadSize = req.file.size;
    } else if (req.files && Array.isArray(req.files)) {
      uploadSize = req.files.reduce((total, file) => total + file.size, 0);
    }

    // Check if upload would exceed storage limit
    if (user.storageUsed + uploadSize > user.storageLimit) {
      const remainingStorage = user.storageLimit - user.storageUsed;
      return res.status(413).json({
        success: false,
        message: 'Storage limit exceeded',
        details: {
          uploadSize,
          remainingStorage,
          storageUsed: user.storageUsed,
          storageLimit: user.storageLimit,
        },
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking storage limit',
      error: error.message,
    });
  }
};
