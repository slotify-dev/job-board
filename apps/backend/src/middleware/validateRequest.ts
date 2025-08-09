import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation failed for request:', {
          url: req.url,
          method: req.method,
          body: req.body,
          errors: error.flatten(),
        });
        res.status(400).json({
          error: 'Validation failed',
          details: error.flatten(),
        });
        return;
      }
      console.error('Internal server error in validation:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
      return;
    }
  };
};

export default validateRequest;
