import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { sendError } from '../utils/apiResponse';

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Not authorized, no token', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      sendError(res, 'User not found', 401);
      return;
    }
    if (!user.isActive) {
      sendError(res, 'Account deactivated. Contact an administrator.', 403);
      return;
    }
    req.user = user;
    next();
  } catch {
    sendError(res, 'Not authorized, token invalid', 401);
  }
};
