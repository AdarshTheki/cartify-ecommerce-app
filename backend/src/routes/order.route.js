import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getAllOrders,
  getUserOrders,
  stripeCheckout,
  updateOrderStatus,
} from '../controllers/order.controller.js';

const router = express.Router();

router.route('/').get(verifyJWT(), getAllOrders);

router.patch('/:orderId/status', verifyJWT(['admin']), updateOrderStatus);

router.get('/user', verifyJWT(), getUserOrders);

router.post('/stripe-checkout', verifyJWT(), stripeCheckout);

export default router;
