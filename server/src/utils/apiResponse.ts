import { Response } from 'express';
import { PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T | null = null,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationMeta
): Response => {
  const body: Record<string, unknown> = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
};

export const sendError = (res: Response, message = 'Server Error', statusCode = 500): Response =>
  res.status(statusCode).json({ success: false, message });
