import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Query validation failed',
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

export default validateQuery;
