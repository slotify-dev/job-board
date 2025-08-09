import { describe, it, expect, beforeEach } from '@jest/globals';
import requireRole from '../../middleware/requireRole';
import {
  mockRequest,
  mockResponse,
  mockNext,
  mockEmployerUser,
  mockJobSeekerUser,
  resetMocks,
} from '../utils/testHelpers';

describe('requireRole middleware', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should allow access when user has required role', () => {
    // Arrange
    const middleware = requireRole(['employer']);
    const req = mockRequest({
      user: mockEmployerUser,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should allow access when user has one of multiple allowed roles', () => {
    // Arrange
    const middleware = requireRole(['employer', 'admin']);
    const req = mockRequest({
      user: mockEmployerUser,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should deny access when user does not have required role', () => {
    // Arrange
    const middleware = requireRole(['employer']);
    const req = mockRequest({
      user: mockJobSeekerUser,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Insufficient permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', () => {
    // Arrange
    const middleware = requireRole(['employer']);
    const req = mockRequest({
      user: undefined,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should work with jobSeeker role', () => {
    // Arrange
    const middleware = requireRole(['jobSeeker']);
    const req = mockRequest({
      user: mockJobSeekerUser,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should work with multiple roles including jobSeeker and employer', () => {
    // Arrange
    const middleware = requireRole(['jobSeeker', 'employer']);

    // Test with employer user
    const reqEmployer = mockRequest({ user: mockEmployerUser });
    const resEmployer = mockResponse();
    const nextEmployer = mockNext;

    middleware(reqEmployer, resEmployer, nextEmployer);
    expect(nextEmployer).toHaveBeenCalled();

    // Test with jobSeeker user
    const reqJobSeeker = mockRequest({ user: mockJobSeekerUser });
    const resJobSeeker = mockResponse();
    const nextJobSeeker = mockNext;

    middleware(reqJobSeeker, resJobSeeker, nextJobSeeker);
    expect(nextJobSeeker).toHaveBeenCalled();
  });

  it('should handle empty allowed roles array', () => {
    // Arrange
    const middleware = requireRole([]);
    const req = mockRequest({
      user: mockEmployerUser,
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Insufficient permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle case-sensitive role matching', () => {
    // Arrange
    const middleware = requireRole(['Employer']); // Capital E
    const req = mockRequest({
      user: mockEmployerUser, // has role 'employer'
    });
    const res = mockResponse();
    const next = mockNext;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Insufficient permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should create new middleware instance for each call', () => {
    // Arrange
    const middlewareEmployer = requireRole(['employer']);
    const middlewareJobSeeker = requireRole(['jobSeeker']);

    const reqEmployer = mockRequest({ user: mockEmployerUser });
    const resEmployer = mockResponse();
    const nextEmployer = mockNext;

    const reqJobSeeker = mockRequest({ user: mockJobSeekerUser });
    const resJobSeeker = mockResponse();
    const nextJobSeeker = mockNext;

    // Act
    middlewareEmployer(reqEmployer, resEmployer, nextEmployer);
    middlewareJobSeeker(reqJobSeeker, resJobSeeker, nextJobSeeker);

    // Assert - Both should succeed with their respective roles
    expect(nextEmployer).toHaveBeenCalled();
    expect(nextJobSeeker).toHaveBeenCalled();
    expect(resEmployer.status).not.toHaveBeenCalled();
    expect(resJobSeeker.status).not.toHaveBeenCalled();
  });
});
