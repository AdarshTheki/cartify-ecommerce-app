import { Router } from 'express';
import {
  bulkImageDelete,
  bulkImageUpload,
  deleteImage,
  getImage,
  getImages,
  imageUpload,
  updateImage,
} from '../controllers/image.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT());

router.route('/').get(getImages).post(upload.single('image'), imageUpload);

router.route('/:id').get(getImage).patch(updateImage).delete(deleteImage);

router
  .route('/bulk')
  .post(upload.fields([{ name: 'images', maxCount: 10 }]), bulkImageUpload)
  .delete(bulkImageDelete);

export default router;
