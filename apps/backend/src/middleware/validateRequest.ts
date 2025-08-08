import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.flatten(),
        });
        return;
      }
      res.status(500).json({
        error: 'Internal server error',
      });
      return;
    }
  };
};

export default validateRequest;
