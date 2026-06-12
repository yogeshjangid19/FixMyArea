import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Rate limiter: max 100 requests per 15 minutes per IP
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
