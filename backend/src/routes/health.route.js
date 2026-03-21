import { Router } from 'express';

const router = Router();

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

router.use((req, res) => {
  res.status(405).json({
    statusCode: 405,
    path: req.url,
    method: req.method,
    message: 'API endpoint not found!',
    success: false,
  });
});

router.use((err, req, res, _) => {
  const code = err?.statusCode ?? err?.status ?? 505;
  res.status(code).json({
    statusCode: code,
    path: req.url,
    method: req.method,
    message: err?.message || 'Internal server error!',
    success: false,
  });
});

export default router;
