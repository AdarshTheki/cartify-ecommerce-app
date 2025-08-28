export const errorMiddleware = async (err, req, res, next) => {
  const code = err?.statusCode ?? err?.status ?? 505;
  res.status(code).json({
    statusCode: code,
    path: req.url,
    method: req.method,
    message: err?.message || 'Internal server error!',
    success: false,
  });
};
