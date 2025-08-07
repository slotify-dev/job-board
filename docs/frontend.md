# Frontend Features – Job Board App

This document outlines all frontend functionality for the Job Board project. Built using **React + Vite + Tailwind**,
and designed for a monorepo architecture.

> 🧩 Note: All requests will be made to a backend REST API at `/api`.

---

## 🔐 Authentication (via Auth0)

Authentication is fully managed by **Auth0** using the free Developer Plan (up to 1,000 MAUs). We will not build
a custom auth layer.

### 1. Login / Register (Hosted by Auth0)

- Redirect users to Auth0-hosted login page
- Users sign up or log in with email/password or SSO (Google)
- Frontend receives tokens and stores them securely

### 2. Google SSO

- Enabled through Auth0’s Identity Provider integration
- Part of the same hosted login flow

### 3. Session Handling

- Frontend stores access tokens via the Auth0 React SDK
- Auto-refresh and access token storage handled internally

### 4. Logout

- Calls `Auth0Auth.signOut()`
- Clears session and redirects back to homepage

## 👤 Profile Management

### 5. View My Profile

- Fetch current user's profile
- Render different views for Job Seeker vs Employer

### 6. Edit My Profile

- Job Seeker: name, email, summary
- Employer: company name, contact person
- Formik/Yup forms

---

## 💼 Job Browsing

### 7. Public Job Listings (Homepage)

- Anyone can view jobs
- Fields: `title`, `company`, `location`
- Search bar and filters (by keyword, location, type)

### 8. Job Details Page

- Full description, requirements, employer name
- Apply button (visible only to logged-in Job Seekers)

---

## 📨 Job Applications

### 9. Apply to Job

- Fields: name, email, resume (file upload), cover letter
- File upload: Use `react-dropzone` or native file input
- Resume upload API returns file URL to attach to application

### 10. My Applications Page (Job Seeker)

- List of jobs applied to
- Show status: “Under Review”, “Interview”, “Hired”, “Rejected”

---

## 🧑‍💼 Employer Job Management

### 11. Post a New Job

- Fields: title, location, description, requirements
- Form with validation
- Call `POST /api/jobs`

### 12. Manage My Jobs (Employer Dashboard)

- List of all posted jobs
- Buttons to edit or delete

### 13. Edit Job Posting

- Same form as Post
- Pre-filled data
- API call: `PUT /api/jobs/:id`

### 14. Delete Job

- Button + confirmation
- API call: `DELETE /api/jobs/:id`

---

## 🗂 Review Applications (Employer)

### 15. View Applications per Job

- Show applicants' info: name, resume, cover letter
- Use card or table layout

### 16. Update Application Status

- Dropdown to select new status
- API call: `PATCH /api/applications/:id`

---

## 🧭 Navigation & Auth Guards

### 17. Navigation Bar

- Dynamic links based on role
- Show Login/Register when unauthenticated

### 18. Protected Routes

- Only allow authenticated users to access Dashboard/Profile
- Use `react-router-dom` + role-based guards

---

## ⚠️ Error & Loading Handling

- Global error boundary
- Toast notifications (e.g., `react-hot-toast`)
- Spinners while fetching

---

## 📚 Third-Party Libraries Suggested

## � Opinionated React + TypeScript Stack (Staff Engineer Picks)

| **Category**         | **Chosen Library**                 | **Why?**                                                                 |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| **Forms**            | **React Hook Form + Zod**          | Uncontrolled = better perf. Zod = type-safe validation.                  |
| **State Management** | **Redux Toolkit (RTK)**            | RTK Query for caching + minimal boilerplate. Scales better than Context. |
| **Styling**          | **Tailwind CSS**                   | Utility-first = faster dev. No runtime JS = better performance.          |
| **Routing**          | **react-router-dom**               | Standard for SPAs. Supports lazy loading + nested routes.                |
| **Notifications**    | **Sonner**                         | Lighter (~1kB) than react-hot-toast. Smoother animations.                |
| **Data Fetching**    | **TanStack Query**                 | Smarter caching than RTK Query for complex APIs. Auto refetch/retry.     |
| **UI Components**    | **shadcn/ui**                      | Radix-based, unstyled, accessible. Better than MUI for custom designs.   |
| **Drag & Drop**      | **@dnd-kit/core**                  | Modular, performant, and touch-friendly. Replaces react-beautiful-dnd.   |
| **Testing**          | **Vitest + React Testing Library** | Faster than Jest. Native ESM support.                                    |
