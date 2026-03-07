import { Router } from 'express';

import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  getBrandList,
  updateBrand,
} from '../controllers/brand.controller.js';

const router = Router();

router.get('/', getAllBrands);

router.post(
  '/',
  upload.single('thumbnail'),
  verifyJWT(['admin', 'seller']),
  createBrand
);

router.get('/list', getBrandList);

router.get('/:id', getBrandById);

router.patch(
  '/:id',
  verifyJWT(['admin', 'seller']),
  upload.single('thumbnail'),
  updateBrand
);

router.delete('/:id', verifyJWT(['admin', 'seller']), deleteBrand);

export default router;
