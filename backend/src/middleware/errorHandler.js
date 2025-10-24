// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  
  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  // Sequelize Database Error
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = 'Database Error';
  }

  // Sequelize Connection Error
  if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Database connection failed';
  }

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 Not Found Handler
// Catches requests to non-existent routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};