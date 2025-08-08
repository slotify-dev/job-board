# Job Board Security Implementation

This document provides a comprehensive overview of the security measures implemented in the Job Board API,
including the rationale behind our choices and architectural decisions.

## Overview

Our security implementation follows defense-in-depth principles with multiple layers of protection:

1. **Authentication & Authorization**
2. **Rate Limiting & DDoS Protection**
3. **Request Validation**
4. **Secure Session Management**
5. **Infrastructure Security**

## 1. Authentication & Authorization

### JWT Implementation

**Choice**: JSON Web Tokens (JWT) with HTTP-only cookies
**Library**: `jsonwebtoken` v9.0.2

#### Why JWT?

- **Stateless**: No server-side session storage required
- **Scalable**: Works across multiple server instances
- **Standards-based**: RFC 7519 compliant
- **Flexible**: Supports various signing algorithms

#### Security Features

```typescript
const token = jwt.sign(
  { userId: user.id },
  authConfig.jwtSecret,
  { expiresIn: authConfig.jwtExpiresIn }, // 7 days
);
```

- **Expiration**: Tokens expire after 7 days to limit exposure
- **Secret Management**: Uses environment variable for signing key
- **Claims**: Minimal payload (only user ID) to reduce token size

#### Cookie Configuration

```typescript
cookieOptions: {
  secure: env.NODE_ENV === 'production', // HTTPS only in production
  maxAge: 7 * 24 * 60 * 60 * 1000,      // 7 days
  sameSite: 'lax' as const,              // CSRF protection
  httpOnly: true,                         // XSS protection
  path: '/',                             // Available site-wide
}
```

**Security Benefits**:

- `httpOnly: true` prevents XSS attacks accessing tokens
- `secure: true` in production ensures HTTPS-only transmission
- `sameSite: 'lax'` provides CSRF protection while maintaining usability

### Role-Based Access Control (RBAC)

**Implementation**: Middleware-based authorization

```typescript
const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};
```

**Roles**:

- `job_seeker`: Can apply to jobs, manage applications
- `employer`: Can post jobs, manage applications
- Future: `admin` role for system administration

## 2. Rate Limiting & DDoS Protection

### Token Bucket Algorithm

**Choice**: Token Bucket algorithm with Redis backend
**Libraries**: Custom implementation with Redis v5.8.0

#### Why Token Bucket?

- **Burst Handling**: Allows temporary spikes in traffic
- **Flexible**: Different rates for different endpoints
- **Fair**: Distributed rate limiting across multiple servers
- **Efficient**: O(1) operations with Redis Lua scripts

#### Algorithm Implementation

```lua
-- Redis Lua script for atomic token consumption
local tokens = tonumber(bucket[1]) or capacity
local time_elapsed = math.max(0, now - last_refill)
local tokens_to_add = math.floor((time_elapsed / 1000) * (refill_rate / (window_ms / 1000)))
tokens = math.min(capacity, tokens + tokens_to_add)

if tokens >= tokens_requested then
  tokens = tokens - tokens_requested
  return {1, tokens, 0} -- allowed, remaining, retry_after
end
```

#### Rate Limit Configurations

| Endpoint Type    | Window | Capacity     | Refill Rate | Use Case                  |
| ---------------- | ------ | ------------ | ----------- | ------------------------- |
| Authentication   | 15 min | 5 requests   | 5/15min     | Prevent brute force       |
| Job Applications | 1 hour | 10 requests  | 10/hour     | Prevent spam applications |
| Job Posting      | 1 hour | 5 requests   | 5/hour      | Prevent job spam          |
| General API      | 1 min  | 100 requests | 100/min     | General protection        |
| Per-User         | 1 min  | 200 requests | 200/min     | Authenticated users       |

#### Redis Backend Benefits

- **Distributed**: Works across multiple server instances
- **Persistent**: Rate limit state survives server restarts
- **Atomic**: Lua scripts ensure race-condition-free operations
- **Scalable**: Redis clustering support for high availability

### Fail-Safe Behavior

```typescript
catch (error) {
  console.error('Rate limiting error:', error);
  // Fail open - allow request if Redis is down
  return { allowed: true, tokensRemaining: capacity };
}
```

**Rationale**: Availability over security - temporary rate limit failures shouldn't break the service.

## 3. Request Validation

### Schema-Based Validation

**Choice**: Zod v3.25.76 for TypeScript-first schema validation

#### Why Zod?

- **Type Safety**: Generates TypeScript types from schemas
- **Runtime Validation**: Validates data at runtime
- **Composable**: Reusable validation schemas
- **Developer Experience**: Excellent error messages

#### Implementation

```typescript
const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase, and number',
    ),
  role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
});
```

#### Validation Layers

1. **Parameter Validation**: URL parameters
2. **Query Validation**: Query strings
3. **Body Validation**: Request payload
4. **File Validation**: Uploaded files (future)

## 4. Password Security

### bcrypt Implementation

**Choice**: bcryptjs v3.0.2
**Configuration**: 12 salt rounds

#### Why bcrypt?

- **Adaptive**: Configurable work factor
- **Salt**: Built-in salt generation
- **Time-tested**: Industry standard for password hashing
- **Slow by Design**: Resistant to brute force attacks

```typescript
const passwordHash = await bcrypt.hash(password, 12);
```

**Rationale for 12 rounds**: Balances security and performance. Takes ~300ms to hash, making brute force
attacks impractical while maintaining reasonable user experience.

## 5. Architecture Security

### Service Layer Separation

**Single Responsibility Principle**: Each service handles one concern

- `redisService.ts`: Redis connection and basic operations only
- `rateLimitService.ts`: Rate limiting logic using Redis
- Separate middleware files for each validation type

### Middleware Chain

```text
Request → Global Rate Limit → Auth (if required) → Role Check → Validation → Controller
```

Each middleware has a single responsibility and can be composed as needed.

### Error Handling

```typescript
// Secure error responses - no sensitive information leaked
catch (error) {
  console.error('Internal error:', error); // Log detail server-side
  return res.status(500).json({ error: 'Internal server error' }); // Generic client response
}
```

## 6. Infrastructure Security

### Redis Configuration

```yaml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-}
  sysctls:
    - net.core.somaxconn=1024 # Handle high connection loads
```

**Security Features**:

- Password protection (optional but recommended)
- Persistence enabled for rate limit state
- Connection limits configured
- Alpine Linux base for minimal attack surface

### Environment Variables

All sensitive configuration externalized:

- `JWT_SECRET`: Token signing key
- `REDIS_PASSWORD`: Redis authentication
- `DATABASE_URL`: Database connection
- Rate limiting parameters

## 7. Security Headers

Implemented via Helmet.js:

- `Content-Security-Policy`: XSS protection
- `X-Frame-Options`: Clickjacking protection
- `X-Content-Type-Options`: MIME type sniffing protection
- `Strict-Transport-Security`: HTTPS enforcement
- `X-XSS-Protection`: Legacy XSS protection

## 8. Monitoring & Logging

### Security Events Logged

- Authentication failures
- Rate limit violations
- Authorization failures
- Invalid requests
- System errors

### Rate Limit Headers

Response headers for client guidance:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 2024-01-01T12:00:00Z
Retry-After: 60
```

## 9. Trade-offs & Considerations

### JWT vs Sessions

**Chosen**: JWT
**Trade-off**: Can't revoke tokens before expiration
**Mitigation**: Short expiration times (7 days) and future refresh token implementation

### Token Bucket vs Fixed Window

**Chosen**: Token Bucket
**Trade-off**: More complex implementation
**Benefit**: Better user experience with burst handling

### Redis Dependency

**Chosen**: Redis for rate limiting
**Trade-off**: Additional infrastructure dependency
**Benefit**: Distributed rate limiting and persistence

### Fail-Open vs Fail-Closed

**Chosen**: Fail-open for rate limiting
**Trade-off**: Temporary security reduction during Redis outages
**Benefit**: Service availability maintained

## 10. Future Enhancements

1. **Refresh Tokens**: For token revocation capability
2. **Account Lockout**: After multiple failed attempts
3. **Audit Logging**: Structured security event logging
4. **WAF Integration**: Application firewall for additional protection
5. **OAuth Integration**: Google/GitHub social login
6. **2FA Support**: Multi-factor authentication
7. **API Key Management**: For third-party integrations

## 11. Security Testing

### Recommended Testing

1. **Authentication Bypass**: Attempt to access protected routes
2. **Rate Limit Testing**: Verify limits are enforced
3. **Input Validation**: Test malformed requests
4. **Token Manipulation**: Verify JWT validation
5. **CSRF Testing**: Ensure same-site protection works
6. **SQL Injection**: Test database query safety (Drizzle ORM provides protection)

## Conclusion

This security implementation provides enterprise-grade protection suitable for production use. The layered
approach ensures multiple fallback mechanisms, while the choice of battle-tested libraries and algorithms
provides reliability and maintainability.

The architecture follows security best practices while maintaining developer productivity and system
performance. Regular security reviews and updates should be conducted as the application evolves.
