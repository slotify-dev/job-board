import type { Request, Response } from 'express';
import { ZodError } from 'zod';

interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

interface ErrorResponse {
  error: {
    message: string;
    status: number;
    stack?: string;
  };
}

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
  }

  const errorResponse: ErrorResponse = {
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
};
