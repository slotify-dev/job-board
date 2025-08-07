# Backend Features – Job Board App

This document outlines all backend features for the Job Board project. Built using **Bun + Express + TypeScript**,
connected to **PostgreSQL** using `Knex` or `Drizzle`.

> ⚠️ All code must be strict TypeScript (no `any`).  
> 🧩 Auth uses Okta (OAuth2 + JWT). Role-based access is enforced via middleware.

---

## 🔐 Authentication (via Okta)

We use **Okta** as our authentication provider. The backend validates tokens issued by Okta and extracts user
identity and roles.

### 🔑 JWT Middleware

- All protected routes use JWT tokens issued by Okta
- Middleware verifies the token via `jwks-rsa` (JWKS endpoint)

### 🎯 Role-Based Access

- Roles come from Okta claims:
  - `groups` (Okta groups like `job_seeker`, `employer`)
  - or custom claims like `custom:role`
- Middleware: `requireRole('job_seeker' | 'employer')`

### 📦 Required Tools

| Tool                            | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `jsonwebtoken`                  | Verifies tokens                       |
| `jwks-rsa`                      | Fetches public key for JWT validation |
| `express-jwt`                   | Express middleware for JWT            |
| `dotenv`                        | Loads `.env` for Okta config          |
| `@okta/jwt-verifier` (optional) | Official Okta JWT SDK                 |

### 🧱 Middleware Flow

1. Check `Authorization: Bearer <token>`
2. Verify token issuer = Okta domain
3. Decode claims to get `sub`, `email`, and `groups`
4. Inject user into `req.user`

---

## 👤 User Profile

### 6. Get My Profile

- Route: `GET /api/users/me`
- Returns data based on role

### 7. Update My Profile

- Route: `PUT /api/users/me`
- Supports both employer/job seeker profile fields

---

## 💼 Jobs

### 8. List All Jobs (Public)

- Route: `GET /api/jobs`
- Returns jobs with filters/search support

### 9. Get Job Details

- Route: `GET /api/jobs/:id`

### 10. Create Job (Employer)

- Route: `POST /api/jobs`
- Requires role: employer

### 11. Edit Job

- Route: `PUT /api/jobs/:id`
- Role: employer, ownership check

### 12. Delete Job

- Route: `DELETE /api/jobs/:id`
- Role: employer

---

## 📝 Applications

### 13. Apply to Job

- Route: `POST /api/jobs/:id/apply`
- Requires role: job seeker
- Accepts resume URL and cover letter

### 14. Get My Applications (Job Seeker)

- Route: `GET /api/applications/me`

### 15. View Applications (Employer)

- Route: `GET /api/jobs/:id/applications`
- Returns all applicants for a job

### 16. Update Application Status

- Route: `PATCH /api/applications/:id`
- Allows changing status ("Under Review", etc.)

---

## 📄 File Uploads

### 17. Upload Resume

- Route: `POST /api/upload`
- Accepts multipart/form-data
- Saves file to S3 or local `uploads/`
- Returns file URL

---

## 🧪 Input Validation

- Use **Zod** to validate request bodies
- Attach schemas to route handlers
- Avoid accepting raw inputs directly

---

## 📊 Database Tables

- `users`: id, email, password_hash, role, sso_id, created_at
- `employers`: user_id (FK), company_name, contact_person
- `job_seekers`: user_id (FK), full_name, resume_url
- `jobs`: id, employer_id, title, description, location
- `applications`: id, job_id, job_seeker_id, resume_url, cover_letter, status
