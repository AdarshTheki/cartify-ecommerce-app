import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const ALLOWED_VIDEO_MIME = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_DOC_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Build a multer fileFilter that accepts a given set of MIME types.
 */
const buildFileFilter = (allowedMimes) => (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        415,
        `Unsupported file type "${file.mimetype}". Allowed: ${allowedMimes.join(', ')}`
      ),
      false
    );
  }
};

// ─── Pre-built Upload Instances ───────────────────────────────────────────────

/** Accept only images (jpeg / png / webp / gif), max 5 MB each */
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: buildFileFilter(ALLOWED_IMAGE_MIME),
});

/** Accept images OR videos, max 50 MB each */
const uploadMedia = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: buildFileFilter([...ALLOWED_IMAGE_MIME, ...ALLOWED_VIDEO_MIME]),
});

/** Accept documents (PDF / Word), max 10 MB each */
const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: buildFileFilter(ALLOWED_DOC_MIME),
});

/** Accept any file type, max 20 MB — use sparingly */
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export { uploadImage, uploadMedia, uploadDocument, upload };
