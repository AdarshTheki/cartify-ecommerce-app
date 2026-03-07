import Stripe from 'stripe';
import { Cart } from '../models/cart.model.js';
import { Order, orderStatus } from '../models/order.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../middlewares/logger.middleware.js';

const stripe = new Stripe(process.env.STRIPE_API_SECRET, {
  apiVersion: '2024-04-10',
});

const orderAggregation = [
  {
    $unwind: '$items',
  },
  {
    $lookup: {
      from: 'products',
      localField: 'items.productId',
      foreignField: '_id',
      as: 'items.product',
    },
  },
  {
    $unwind: {
      path: '$items.product',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      itemTotal: {
        $multiply: ['$items.quantity', '$items.product.price'],
      },
    },
  },
  {
    $group: {
      _id: '$_id',
      customer: { $first: '$customer' },
      shipping_address: { $first: '$shipping_address' },
      payment: { $first: '$payment' },
      status: { $first: '$status' },
      totalPrice: { $sum: '$itemTotal' },
      createdAt: { $first: '$createdAt' },
      updatedAt: { $first: '$updatedAt' },
      items: {
        $push: {
          productId: '$items.productId',
          quantity: '$items.quantity',
          product: {
            title: '$items.product.title',
            price: '$items.product.price',
            thumbnail: '$items.product.thumbnail',
          },
        },
      },
    },
  },
];

// @desc    Get all orders for dashboard
// @route   GET /api/v1/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || 10;
  const sort = req.query?.sortBy || 'createdAt';
  const order = req.query?.orderBy || 'desc';

  const orders = await Order.aggregate([
    { $match: { _id: { $ne: null } } },
    ...orderAggregation,
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $sort: { [sort]: order === 'asc' ? 1 : -1 } },
  ]);

  if (!orders) {
    throw new ApiError(404, 'Orders not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'User orders retrieved successfully'));
});

// @desc    Get user's orders
// @route   GET /api/v1/orders/my
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || 10;
  const sort = req.query?.sort || 'createdAt';
  const order = req.query?.order || 'desc';

  const orders = await Order.aggregate([
    { $match: { customer: req.user._id } },
    ...orderAggregation,
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $sort: { [sort]: order === 'asc' ? 1 : -1 } },
  ]);

  if (!orders) {
    throw new ApiError(404, 'Orders not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'User orders retrieved successfully'));
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:orderId/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderStatus.includes(status)) {
    throw new ApiError(400, 'Invalid order status');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;
  await order.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated successfully'));
});

// @desc    Stripe webhook handler
// @route   POST /api/v1/orders/webhook
// @access  Public (Stripe)
export const stripeWebhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { type, data } = event;

  try {
    switch (type) {
      case 'payment_intent.succeeded':
        break;

      case 'checkout.session.completed': {
        const session = data.object;

        const cart = await Cart.findOne({
          createdBy: session?.metadata?.userId,
        });

        if (!cart || !cart.items?.length) {
          return res.status(404).json({ message: 'Cart is Empty' });
        }

        const order = new Order({
          customer: session.metadata.userId,
          items: cart.items,
          shipping_address: {
            line1: session.customer_details.address.line1,
            line2: session.customer_details.address.line2,
            city: session.customer_details.address.city,
            country: session.customer_details.address.country,
            postal_code: session.customer_details.address.postal_code,
            state: session.customer_details.address.state,
            name: session.customer_details.name,
            email: session.customer_details.email,
          },
          payment: {
            id: session.id,
            method: session.payment_method_types[0],
            status: session.payment_status,
          },
        });

        await order.save();

        cart.items = [];

        await cart.save();

        logger.info('✅ Order created via webhook:', order._id);
        break;
      }

      default:
        logger.warn(`Unhandled event type: ${type}`);
    }

    return res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (err) {
    logger.error('Webhook handler:', err.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/v1/orders/checkout
// @access  Private
export const stripeCheckout = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  if (!userId) throw new ApiError(404, 'user not found');

  const cart = await Cart.findOne({
    createdBy: userId,
  }).populate('items.productId');

  if (!cart || !cart.items?.length) {
    throw new ApiError(400, 'Cart is empty');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id: cart._id.toString(),
    shipping_address_collection: { allowed_countries: ['IN'] },
    metadata: { userId },
    line_items: cart.items?.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productId.title,
          images: [item.productId.thumbnail],
        },
        unit_amount: Math.floor(item.productId.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.CLIENT_REDIRECT_URL}/order/success`,
    cancel_url: `${process.env.CLIENT_REDIRECT_URL}/order/failed`,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { url: session.url }, 'Checkout session created')
    );
});
