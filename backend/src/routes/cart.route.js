import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  // moveFromWishlistToCart,
  // moveToWishlist,
  // shareCart,
} from '../controllers/cart.controller.js';

const router = Router();

router.use(verifyJWT());

router.route('/').get(getCart).post(addToCart).put(updateCartItemQuantity);
router.route('/:id').delete(removeFromCart);
router.delete('/', clearCart);
// router.post("/wishlist", moveToWishlist);
// router.post("/cart", moveFromWishlistToCart);
// router.get("/share", shareCart);

export default router;
