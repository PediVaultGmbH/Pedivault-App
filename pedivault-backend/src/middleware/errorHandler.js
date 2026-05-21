// src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Prisma: unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({ success: false, error: `${field} is already in use` });
  }
  // Prisma: record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  // Prisma: foreign key / related record missing
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, error: 'Related record not found' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, error: 'Invalid token. Please sign in again.' });
  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, error: 'Session expired. Please sign in again.' });

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(413).json({ success: false, error: 'File is too large. Maximum size is 10MB.' });
  if (err.message?.includes('Only JPG'))
    return res.status(415).json({ success: false, error: err.message });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? 'Something went wrong. Please try again.' : err.message,
    ...(process.env.NODE_ENV === 'development' && status === 500 && { detail: err.message }),
  });
}

module.exports = errorHandler;
