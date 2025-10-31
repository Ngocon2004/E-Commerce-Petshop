// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Resource already exists';
        error.statusCode = 409;
        break;
      case '23503': // Foreign key violation
        error.message = 'Referenced resource does not exist';
        error.statusCode = 400;
        break;
      case '23502': // Not null violation
        error.message = 'Required field is missing';
        error.statusCode = 400;
        break;
      case '42P01': // Undefined table
        error.message = 'Database table not found';
        error.statusCode = 500;
        break;
      case 'ECONNREFUSED':
        error.message = 'Database connection failed';
        error.statusCode = 500;
        break;
      default:
        error.message = 'Database error';
        error.statusCode = 500;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message;
    error.statusCode = 400;
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'File too large';
    error.statusCode = 400;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.message = 'Unexpected file field';
    error.statusCode = 400;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
};

// Async error wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
};
