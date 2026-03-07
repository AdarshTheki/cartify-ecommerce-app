import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createReview,
  deleteReview,
  getReviewsByProduct,
  likeReview,
  updateReview,
} from '../controllers/review.controller.js';

const router = Router();

router.route('/:productId').get(getReviewsByProduct);

router.use(verifyJWT());

router.route('/').post(createReview);

router.route('/:reviewId').patch(updateReview).delete(deleteReview);

router.post('/:reviewId/like', likeReview);

export default router;
