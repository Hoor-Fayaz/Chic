function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = { notFoundHandler, errorHandler };

