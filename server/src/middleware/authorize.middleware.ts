import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const authorize = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Access denied: insufficient permissions', 403);
      return;
    }
    next();
  };
