import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByFilter,
  searchProducts,
  updateProduct,
} from '../controllers/product.controller.js';

const router = Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    verifyJWT(['admin', 'seller']),
    createProduct
  );

router.route('/:query/:name').get(getProductsByFilter);
router.route('/search').get(searchProducts);

router
  .route('/:productId')
  .get(getProductById)
  .patch(
    upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    verifyJWT(['admin', 'seller']),
    updateProduct
  )
  .delete(verifyJWT(['admin', 'seller']), deleteProduct);

export default router;
