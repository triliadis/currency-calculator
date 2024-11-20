import rateLimit from 'express-rate-limit';

// Middleware to limit login attempts
export const loginRateLimiterMiddleware = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts. Please try again later.',
});
