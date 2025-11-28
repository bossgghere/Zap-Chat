import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Attach userId to request
    (req as any).userId = decoded.id;

    next(); // Continue to next middleware/controller
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};