import multer from 'multer';
import { Router } from 'express';
import {
  uploadSingle,
  listFiles,
  uploadMultiple,
  getPresignedUrl,
  downloadFile,
  deleteFile,
} from '../controllers/s3Bucket.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    // 20 MB per file — adjust as needed
    fileSize: 20 * 1024 * 1024,
  },
});

const router = Router();

router.get('/', listFiles);
router.get('/presign', getPresignedUrl);
router.get('/download/:key', downloadFile); // key must be URL-encoded when calling
router.post('/upload', upload.single('file'), uploadSingle);
router.post('/uploads', upload.array('files', 10), uploadMultiple);
router.delete('/:key', verifyJWT(['admin']), deleteFile); // key must be URL-encoded when calling

export default router;
