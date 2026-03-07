import { Router } from 'express';
import {
  getTotals,
  getTopProducts,
  getTopCategories,
  getOrdersChart,
  getDownloadData,
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/totals', getTotals);
router.get('/top-products', getTopProducts);
router.get('/top-categories', getTopCategories);
router.get('/orders-chart', getOrdersChart);
router.get('/download/:slug', getDownloadData);

export default router;
