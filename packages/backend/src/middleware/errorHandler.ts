import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@chalk-ai/shared';

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  const code = error.code || 'INTERNAL_ERROR';

  const response: ApiError = {
    message,
    code,
    details: process.env.NODE_ENV === 'development' ? error.details : undefined,
  };

  res.status(status).json(response);
}
