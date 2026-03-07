import { Router } from 'express';
import {
  imageEffect,
  removeBackground,
  removeObject,
  getAllImages,
  removeCloudinaryFile,
  uploadCloudinaryFile,
} from '../controllers/cloudinary.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT());

router.get('/', getAllImages);
router.post('/', upload.single('image'), uploadCloudinaryFile);
router.delete('/', removeCloudinaryFile);

router.post('/image-effect', upload.single('image'), imageEffect);
router.post('/remove-background', upload.single('image'), removeBackground);
router.post('/remove-object', upload.single('image'), removeObject);

export default router;
