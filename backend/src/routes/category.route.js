import { Router } from 'express';

import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryList,
  updateCategory,
} from '../controllers/category.controller.js';

const router = Router();

router
  .route('/')
  .get(getAllCategories)
  .post(
    upload.single('thumbnail'),
    verifyJWT(['admin', 'seller']),
    createCategory
  );
router.get('/list', getCategoryList);
router
  .route('/:id')
  .get(getCategoryById)
  .patch(
    verifyJWT(['admin', 'seller']),
    upload.single('thumbnail'),
    updateCategory
  )
  .delete(verifyJWT(['admin']), deleteCategory);

export default router;
