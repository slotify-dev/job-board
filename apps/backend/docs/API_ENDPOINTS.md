# Job Board API Endpoints

All endpoints return `{ success: true }` for now. Implementation will be added later.

## Public Endpoints

| Method | Endpoint          | Description                                   | Module |
| ------ | ----------------- | --------------------------------------------- | ------ |
| GET    | `/api/jobs`       | Public job listings with pagination/filtering | jobs   |
| GET    | `/api/jobs/:uuid` | Detailed job view                             | jobs   |

## Authentication Endpoints

| Method | Endpoint                   | Description                            | Module |
| ------ | -------------------------- | -------------------------------------- | ------ |
| POST   | `/api/auth/register`       | Register user (job_seeker or employer) | auth   |
| POST   | `/api/auth/login`          | Login with email/password              | auth   |
| POST   | `/api/auth/oauth/callback` | OAuth2 login callback                  | auth   |
| GET    | `/api/auth/me`             | Get logged-in user info                | auth   |
| POST   | `/api/auth/logout`         | Logout user                            | auth   |

## Profile Management Endpoints

| Method | Endpoint          | Description                             | Module  | Role Required |
| ------ | ----------------- | --------------------------------------- | ------- | ------------- |
| GET    | `/api/me/profile` | Get my profile (job seeker or employer) | profile | authenticated |
| PUT    | `/api/me/profile` | Update my profile                       | profile | authenticated |

## Employer Endpoints

| Method | Endpoint                                | Description                  | Module   | Role Required |
| ------ | --------------------------------------- | ---------------------------- | -------- | ------------- |
| POST   | `/api/employer/jobs`                    | Post a new job               | employer | employer      |
| GET    | `/api/employer/jobs`                    | Get my posted jobs           | employer | employer      |
| GET    | `/api/employer/jobs/:uuid`              | Get my job by UUID           | employer | employer      |
| PUT    | `/api/employer/jobs/:uuid`              | Update my job                | employer | employer      |
| DELETE | `/api/employer/jobs/:uuid`              | Delete my job                | employer | employer      |
| GET    | `/api/employer/jobs/:uuid/applications` | View applications for my job | employer | employer      |
| PATCH  | `/api/employer/applications/:uuid`      | Update application status    | employer | employer      |

## Job Application Endpoints

| Method | Endpoint                | Description               | Module       | Role Required |
| ------ | ----------------------- | ------------------------- | ------------ | ------------- |
| POST   | `/api/jobs/:uuid/apply` | Apply to a job            | applications | job_seeker    |
| GET    | `/api/me/applications`  | My submitted applications | applications | job_seeker    |

## Module Structure

```text
src/modules/
├── auth/
│   ├── auth.types.ts      # Auth request/response types
│   ├── auth.controller.ts # Auth business logic
│   └── auth.routes.ts     # Auth route definitions
├── jobs/
│   ├── jobs.types.ts      # Job-related types
│   ├── jobs.controller.ts # Public job logic
│   └── jobs.routes.ts     # Public job routes
├── profile/
│   ├── profile.types.ts   # Profile types
│   ├── profile.controller.ts # Profile management
│   └── profile.routes.ts  # Profile routes
├── employer/
│   ├── employer.types.ts  # Employer-specific types
│   ├── employer.controller.ts # Job & application management
│   └── employer.routes.ts # Employer routes
└── applications/
    ├── applications.types.ts # Application types
    ├── applications.controller.ts # Job application logic
    └── applications.routes.ts # Application routes
```

## Next Steps

1. Implement authentication middleware for protected routes
2. Add role-based authorization middleware
3. Implement actual business logic in controllers
4. Add request validation using Zod schemas
5. Add proper error handling and responses
6. Add database queries using Drizzle ORM
7. Add API documentation with Swagger/OpenAPI
