import { Request, Response } from 'express';

// Mock request helper
export const mockRequest = (overrides: Partial<Request> = {}): Request => {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    user: undefined,
    ...overrides,
  } as Request;
  return req;
};

// Mock response helper
export const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function - reset before each test
export const mockNext = jest.fn();

// Helper to reset mocks
export const resetMocks = () => {
  mockNext.mockClear();
};

// Test user data
export const mockEmployerUser = {
  id: 1,
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'employer@example.com',
  role: 'employer' as const,
  createdAt: new Date('2023-01-01'),
};

export const mockJobSeekerUser = {
  id: 2,
  uuid: '223e4567-e89b-12d3-a456-426614174000',
  email: 'jobseeker@example.com',
  role: 'jobSeeker' as const,
  createdAt: new Date('2023-01-01'),
};

// Test job data
export const mockJob = {
  id: 1,
  uuid: '333e4567-e89b-12d3-a456-426614174000',
  employerId: 1,
  title: 'Software Engineer',
  description: 'We are looking for a skilled software engineer...',
  location: 'San Francisco, CA',
  requirements: 'Bachelor degree in Computer Science, 3+ years experience',
  status: 'active',
  createdAt: new Date('2023-01-01'),
};

// Test application data
export const mockApplication = {
  uuid: '444e4567-e89b-12d3-a456-426614174000',
  jobId: 1,
  jobSeekerId: 2,
  resumeUrl: 'https://example.com/resume.pdf',
  coverLetter: 'I am very interested in this position...',
  status: 'pending',
  createdAt: new Date('2023-01-01'),
  jobSeekerName: 'John Doe',
  jobSeekerContactInfo: 'john@example.com',
};

// Test employer data
export const mockEmployer = {
  id: 1,
  userId: 1,
  companyName: 'Tech Corp',
  contactEmail: 'hr@techcorp.com',
  companyDescription: 'Leading technology company',
  createdAt: new Date('2023-01-01'),
};
