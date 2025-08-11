import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { z } from 'zod';
import validateRequest from '../../middleware/validateRequest';
import {
  mockRequest,
  mockResponse,
  mockNext,
  resetMocks,
} from '../utils/testHelpers';

describe('validateRequest middleware', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('with simple schema', () => {
    const simpleSchema = z.object({
      name: z.string().min(1),
      age: z.number().min(0),
    });

    it('should pass validation with valid data', () => {
      // Arrange
      const middleware = validateRequest(simpleSchema);
      const req = mockRequest({
        body: {
          name: 'John Doe',
          age: 25,
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body).toEqual({
        name: 'John Doe',
        age: 25,
      });
    });

    it('should fail validation with missing required field', () => {
      // Arrange
      const middleware = validateRequest(simpleSchema);
      const req = mockRequest({
        body: {
          age: 25,
          // name is missing
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            name: expect.arrayContaining(['Required']),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid type', () => {
      // Arrange
      const middleware = validateRequest(simpleSchema);
      const req = mockRequest({
        body: {
          name: 'John Doe',
          age: 'not-a-number',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            age: expect.arrayContaining(['Expected number, received string']),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('with job creation schema', () => {
    const jobSchema = z.object({
      title: z.string().min(1).max(255),
      description: z.any(),
      location: z.string().max(255).optional(),
      status: z
        .enum(['active', 'draft', 'reviewing', 'closed'])
        .default('active'),
    });

    it('should validate job creation with all fields', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: 'Software Engineer',
          description: 'We are looking for a skilled software engineer...',
          location: 'San Francisco, CA',
          requirements: 'Bachelor degree in Computer Science',
          status: 'active',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should validate job creation with minimal required fields', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: 'Backend Developer',
          description: 'Join our backend team',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(req.body).toEqual({
        title: 'Backend Developer',
        description: 'Join our backend team',
        status: 'active', // Should have default value
      });
    });

    it('should fail validation with empty title', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: '',
          description: 'Job description',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            title: expect.arrayContaining([
              'String must contain at least 1 character(s)',
            ]),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with title too long', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const longTitle = 'a'.repeat(256); // Exceeds 255 character limit
      const req = mockRequest({
        body: {
          title: longTitle,
          description: 'Job description',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            title: expect.arrayContaining([
              'String must contain at most 255 character(s)',
            ]),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should accept any description format', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: 'Software Engineer',
          description: '',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid status', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: 'Software Engineer',
          description: 'Job description',
          status: 'invalid-status',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            status: expect.arrayContaining([
              // eslint-disable-next-line quotes
              "Invalid enum value. Expected 'active' | 'draft' | 'reviewing' | 'closed', received 'invalid-status'",
            ]),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with location too long', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const longLocation = 'a'.repeat(256);
      const req = mockRequest({
        body: {
          title: 'Software Engineer',
          description: 'Job description',
          location: longLocation,
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            location: expect.arrayContaining([
              'String must contain at most 255 character(s)',
            ]),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle multiple validation errors', () => {
      // Arrange
      const middleware = validateRequest(jobSchema);
      const req = mockRequest({
        body: {
          title: '',
          description: '',
          status: 'invalid',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            title: expect.any(Array),
            status: expect.any(Array),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('with application status schema', () => {
    const statusSchema = z.object({
      status: z.enum([
        'pending',
        'reviewing',
        'interviewed',
        'accepted',
        'rejected',
      ]),
    });

    it('should validate all valid status values', () => {
      const validStatuses = [
        'pending',
        'reviewing',
        'interviewed',
        'accepted',
        'rejected',
      ];

      validStatuses.forEach((status) => {
        // Arrange
        const middleware = validateRequest(statusSchema);
        const req = mockRequest({
          body: { status },
        });
        const res = mockResponse();
        const next = mockNext;

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();

        // Reset for next iteration
        jest.clearAllMocks();
      });
    });

    it('should fail validation with invalid status', () => {
      // Arrange
      const middleware = validateRequest(statusSchema);
      const req = mockRequest({
        body: {
          status: 'invalid-status',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          fieldErrors: expect.objectContaining({
            status: expect.arrayContaining([
              expect.stringContaining('Invalid enum value'),
            ]),
          }),
        }),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle non-ZodError exceptions', () => {
      // Arrange
      const maliciousSchema = {
        parse: jest.fn().mockImplementation(() => {
          throw new Error('Non-Zod error');
        }),
      } as any;

      const middleware = validateRequest(maliciousSchema);
      const req = mockRequest({
        body: { test: 'data' },
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      middleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
