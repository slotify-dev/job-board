// Test setup

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes';
process.env.COOKIE_NAME = 'test-auth-cookie';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock console.error to reduce noise in tests
const originalConsoleError = console.error;

global.beforeEach(() => {
  console.error = jest.fn();
});

global.afterEach(() => {
  console.error = originalConsoleError;
  jest.clearAllMocks();
});
