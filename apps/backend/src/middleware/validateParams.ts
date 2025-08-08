import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Parameter validation failed',
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

export default validateParams;
