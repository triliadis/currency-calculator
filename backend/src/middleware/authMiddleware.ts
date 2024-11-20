import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to verify JWT tokens for authentication
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify token using jwt secret
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired authentication token, please login again.' });
  }
};
