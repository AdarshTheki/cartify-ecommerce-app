import { subDays, subMonths, subYears } from 'date-fns';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Returns a date filter based on query string
 */

function getDateFilter(query) {
  const now = new Date();
  switch (query) {
    case 'last-30-days':
      return subDays(now, 30);
    case 'last-3-month':
      return subMonths(now, 3);
    case 'last-6-month':
      return subMonths(now, 6);
    case 'last-year':
      return subYears(now, 1);
    default:
      return subDays(now, 30);
  }
}

/**
 * Calculates total revenue from orders.
 * If `sinceDate` is provided, filters results by createdAt >= sinceDate
 */
async function calculateRevenue(sinceDate = null) {
  const matchStage = sinceDate ? { createdAt: { $gte: sinceDate } } : {};

  const revenuePipeline = [
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { $unwind: '$productInfo' },
    {
      $project: {
        amount: { $multiply: ['$items.quantity', '$productInfo.price'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ];

  const result = await Order.aggregate(revenuePipeline);
  return result[0]?.totalRevenue || 0;
}

// @desc    Get dashboard totals
// @route   GET /api/v1/dashboard/totals
// @access  Admin
const getTotals = asyncHandler(async (req, res) => {
  const now = new Date();
  const dateFilter = getDateFilter(req.query?.date);

  // Count users, products, and orders
  const [
    totalUsers,
    usersSinceDate,
    totalProducts,
    productsSinceDate,
    totalOrders,
    ordersSinceDate,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: dateFilter } }),
    Product.countDocuments(),
    Product.countDocuments({ createdAt: { $gte: dateFilter } }),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: dateFilter } }),
  ]);

  // Calculate revenues
  const totalRevenue = await calculateRevenue();
  const revenueSinceDate = await calculateRevenue(dateFilter);

  const totals = {
    totalUsers,
    lastMonthUser: usersSinceDate,
    totalProducts,
    lastMonthProduct: productsSinceDate,
    totalOrders,
    lastMonthOrder: ordersSinceDate,
    totalRevenues: totalRevenue,
    lastMonthRevenue: revenueSinceDate,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, totals, 'Dashboard totals retrieved successfully')
    );
});

// @desc    Get dashboard Top Products
// @route   GET /api/v1/dashboard/top-products
// @access  Admin
const getTopProducts = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $match: {
        // status: "delivered",
        'payment.status': 'paid',
      },
    },
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $group: {
        _id: '$items.productId',
        title: { $first: '$productDetails.title' },
        thumbnail: { $first: '$productDetails.thumbnail' },
        category: { $first: '$productDetails.category' },
        brand: { $first: '$productDetails.brand' },
        unitPrice: { $first: '$productDetails.price' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: {
            $multiply: ['$items.quantity', '$productDetails.price'],
          },
        },
      },
    },
    {
      $sort: {
        totalQuantity: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, orders, 'get top products retrieve successfully')
    );
});

// @desc    Get dashboard Top Categories & Brands
// @route   GET /api/v1/dashboard/top-categories
// @access  Admin
const getTopCategories = asyncHandler(async (req, res) => {
  const topCategoryAndBrandStats = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { $unwind: '$productInfo' },
    {
      $project: {
        category: '$productInfo.category',
        brand: '$productInfo.brand',
      },
    },
    {
      $facet: {
        categories: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
        brands: [
          {
            $group: {
              _id: '$brand',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        topCategoryAndBrandStats[0],
        'get top categories and brands successfully'
      )
    );
});

// @desc    Get dashboard orders chart
// @route   GET /api/v1/dashboard/orders-chart
// @access  Admin
const getOrdersChart = asyncHandler(async (req, res) => {
  const ordersChart = await Order.aggregate([
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
        status: { $first: '$status' },
        totalPrice: { $sum: '$itemTotal' },
        createdAt: { $first: '$createdAt' },
        updatedAt: { $first: '$updatedAt' },
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, ordersChart, 'get orders char successfully'));
});

const getDownloadData = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let data;

  switch (slug) {
    case 'order':
      data = await Order.find().sort({ createdAt: 1 }).exec();
      break;
    case 'category':
      data = await Category.find().sort({ createdAt: 1 }).exec();
      break;
    case 'brand':
      data = await Brand.find().sort({ createdAt: 1 }).exec();
      break;
    case 'product':
      data = await Product.find().sort({ createdAt: 1 }).exec();
      break;
    default:
      throw new ApiError(404, 'Invalid param, please check the endpoints');
  }

  res
    .status(200)
    .json(new ApiResponse(200, data, `get download data to ${slug}`));
});

export {
  getTopProducts,
  getTotals,
  getTopCategories,
  getOrdersChart,
  getDownloadData,
};
