import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createComment,
  deleteComment,
  getCommentsByProduct,
  likeComment,
  replyToComment,
  reportComment,
  updateComment,
} from '../controllers/comment.controller.js';

const router = Router();

router.route('/:productId').get(getCommentsByProduct);

router.use(verifyJWT());

router.route('/').post(createComment);
router.route('/:commentId').delete(deleteComment).patch(updateComment);
router.patch('/:commentId/like', likeComment);
router.post('/:commentId/reply', replyToComment);
router.post('/:commentId/report', reportComment);

export default router;
