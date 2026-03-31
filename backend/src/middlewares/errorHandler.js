export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Validation error',
      details: messages,
      error: true,
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      error: true,
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    error: true,
  });
};

export default errorHandler;
