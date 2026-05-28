import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);

  if (err.name === 'CastError') { sendError(res, 'Resource not found', 404); return; }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'Field';
    sendError(res, `${field} already exists`, 400);
    return;
  }
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    sendError(res, message, 400);
    return;
  }
  if (err.name === 'JsonWebTokenError') { sendError(res, 'Invalid token', 401); return; }
  if (err.name === 'TokenExpiredError') { sendError(res, 'Token expired', 401); return; }

  sendError(res, err.message || 'Internal Server Error', err.statusCode ?? 500);
};

export default errorHandler;
