export const apiEndpointMiddleware = async (req, res) => {
  res.status(405).json({
    statusCode: 405,
    path: req.url,
    method: req.method,
    message: 'API Endpoint Not Found',
    success: false,
  });
};
