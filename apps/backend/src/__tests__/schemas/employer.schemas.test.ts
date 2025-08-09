/* eslint-disable quotes */
import { describe, it, expect } from '@jest/globals';
import {
  createJobSchema,
  updateJobSchema,
  updateApplicationStatusSchema,
  jobParamsSchema,
  applicationParamsSchema,
} from '../../modules/employer/employer.types';

describe('Employer Schemas', () => {
  describe('createJobSchema', () => {
    it('should validate valid job creation data', () => {
      const validJob = {
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer...',
        location: 'San Francisco, CA',
        requirements: 'Bachelor degree in Computer Science',
        status: 'active' as const,
      };

      const result = createJobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validJob);
      }
    });

    it('should validate job with minimal required fields', () => {
      const minimalJob = {
        title: 'Backend Developer',
        description: 'Join our backend team',
      };

      const result = createJobSchema.safeParse(minimalJob);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          ...minimalJob,
          status: 'active', // Should have default value
        });
      }
    });

    it('should include requirements field when provided', () => {
      const jobWithRequirements = {
        title: 'Senior Developer',
        description: 'Senior position',
        requirements: '5+ years experience, React, Node.js',
      };

      const result = createJobSchema.safeParse(jobWithRequirements);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requirements).toBe(
          '5+ years experience, React, Node.js',
        );
      }
    });

    it('should fail validation with empty title', () => {
      const invalidJob = {
        title: '',
        description: 'Job description',
      };

      const result = createJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['title'],
            message: 'String must contain at least 1 character(s)',
          }),
        );
      }
    });

    it('should fail validation with title too long', () => {
      const longTitle = 'a'.repeat(256);
      const invalidJob = {
        title: longTitle,
        description: 'Job description',
      };

      const result = createJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['title'],
            message: 'String must contain at most 255 character(s)',
          }),
        );
      }
    });

    it('should fail validation with empty description', () => {
      const invalidJob = {
        title: 'Software Engineer',
        description: '',
      };

      const result = createJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['description'],
            message: 'String must contain at least 1 character(s)',
          }),
        );
      }
    });

    it('should fail validation with invalid status', () => {
      const invalidJob = {
        title: 'Software Engineer',
        description: 'Job description',
        status: 'invalid-status',
      };

      const result = createJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['status'],
            message:
              "Invalid enum value. Expected 'active' | 'draft', received 'invalid-status'",
          }),
        );
      }
    });

    it('should fail validation with location too long', () => {
      const longLocation = 'a'.repeat(256);
      const invalidJob = {
        title: 'Software Engineer',
        description: 'Job description',
        location: longLocation,
      };

      const result = createJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['location'],
            message: 'String must contain at most 255 character(s)',
          }),
        );
      }
    });
  });

  describe('updateJobSchema', () => {
    it('should validate partial job updates', () => {
      const update = {
        title: 'Senior Software Engineer',
        requirements: 'Updated requirements',
      };

      const result = updateJobSchema.safeParse(update);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(update);
      }
    });

    it('should validate status update to closed', () => {
      const update = {
        status: 'closed' as const,
      };

      const result = updateJobSchema.safeParse(update);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('closed');
      }
    });

    it('should accept all valid status values', () => {
      const validStatuses = ['active', 'closed', 'draft'] as const;

      validStatuses.forEach((status) => {
        const result = updateJobSchema.safeParse({ status });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe(status);
        }
      });
    });
  });

  describe('updateApplicationStatusSchema', () => {
    it('should validate all valid application status values', () => {
      const validStatuses = ['reviewed', 'accepted', 'rejected'] as const;

      validStatuses.forEach((status) => {
        const result = updateApplicationStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe(status);
        }
      });
    });

    it('should fail validation with invalid status', () => {
      const result = updateApplicationStatusSchema.safeParse({
        status: 'invalid',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['status'],
            message:
              "Invalid enum value. Expected 'reviewed' | 'accepted' | 'rejected', received 'invalid'",
          }),
        );
      }
    });
  });

  describe('jobParamsSchema', () => {
    it('should validate valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = jobParamsSchema.safeParse({ uuid: validUuid });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.uuid).toBe(validUuid);
      }
    });

    it('should fail validation with invalid UUID', () => {
      const result = jobParamsSchema.safeParse({ uuid: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['uuid'],
            message: 'Invalid uuid',
          }),
        );
      }
    });
  });

  describe('applicationParamsSchema', () => {
    it('should validate valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = applicationParamsSchema.safeParse({ uuid: validUuid });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.uuid).toBe(validUuid);
      }
    });

    it('should fail validation with invalid UUID', () => {
      const result = applicationParamsSchema.safeParse({ uuid: 'not-a-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['uuid'],
            message: 'Invalid uuid',
          }),
        );
      }
    });
  });
});
