import { Router } from 'express';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Health check endpoint
router.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString().slice(0, 10),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
  });
});

// Handle unsupported routes
router.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    path: req.url,
    method: req.method,
    message: 'API endpoint not found!',
    success: false,
  });
});

// Global error handler
router.use((err, req, res, _) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      path: req.url,
      method: req.method,
      errors: err.errors || [],
      ...(process.env.NODE_ENV !== 'PRODUCTION' && { stack: err.stack }),
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    path: req.url,
    method: req.method,
  });
});

export default router;
