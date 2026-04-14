import { Router } from 'express';
import { uploadImage } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
  adminGetAllProducts,
  adminDeleteProduct,
} from '../controllers/product.controller.js';

const router = Router();

const uploadFields = uploadImage.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

router
  .route('/')
  .get(getAllProducts)
  .post(uploadFields, verifyJWT(['admin', 'seller']), createProduct);

router.route('/search').get(searchProducts);

router
  .route('/:productId')
  .get(getProductById)
  .patch(uploadFields, verifyJWT(['admin', 'seller']), updateProduct)
  .delete(verifyJWT(['admin', 'seller']), deleteProduct);

router.route('/admin').get(verifyJWT(['admin']), adminGetAllProducts);
router
  .route('/admin/:productId')
  .delete(verifyJWT(['admin']), adminDeleteProduct);

export default router;
