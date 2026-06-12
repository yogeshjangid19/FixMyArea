import logger from './logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, error: err.message || 'Server Error' });
};
