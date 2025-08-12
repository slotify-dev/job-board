# Job Board Application

A modern, full-stack job board platform that connects employers with job seekers through an intuitive and secure web application. Built with TypeScript, React, Express.js, and PostgreSQL, this application provides a complete hiring ecosystem with advanced search, role-based dashboards, and enterprise-grade security.

## 🎯 What This Application Offers

**For Job Seekers**: Advanced job search, one-click applications, resume management, and real-time application tracking.

**For Employers**: Comprehensive job posting management, candidate review system, company branding, and hiring analytics.

**Security & Authentication**: Dual authentication (password + Google OAuth2), role-based access control, and secure session management.

**Technical Excellence**: High-performance architecture with optimized queries, responsive design, and modern development practices.

➡️ **[View Complete Feature Overview](docs/features.md)** - Detailed breakdown of all functionality and capabilities

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (only requirements!)

## Local Setup

```bash
# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Install dependencies for all workspaces
bun install

# build/start docker services
docker-compose up --build

# seeding local data
docker exec job-board-backend bun src/database/seed.ts

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Access service containers
docker-compose exec backend sh
docker-compose exec frontend sh

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build

# Clean build (removes cached layers)
# When there are errors with build image
docker-compose build --no-cache

# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up --build
```

That's it! The entire stack will be running with:

- **PostgreSQL Database**: `localhost:5432`
- **Frontend (React + Vite)**: `http://localhost:5173`
- **Backend API (Express + Bun)**: `http://localhost:3000/api`

**Optional**: To enable Google OAuth login, see the [OAuth Setup Guide](docs/oauth-setup.md).

## Services Overview

| Service          | URL                                | Description                    |
| ---------------- | ---------------------------------- | ------------------------------ |
| **PostgreSQL**   | `localhost:5432`                   | Database server                |
| **Frontend**     | `http://localhost:5173`            | React app with Vite dev server |
| **Backend**      | `http://localhost:3000/api`        | Express API with auto-reload   |
| **Health Check** | `http://localhost:3000/api/health` | API health endpoint            |

## Auto-Reloading Development

Both frontend and backend support hot reload out of the box:

- **Backend**: Uses `bun --watch` for instant restarts on file changes
- **Frontend**: Uses Vite dev server with HMR (Hot Module Replacement)
- **API Proxy**: Frontend automatically proxies `/api` requests to backend

**Test Login Credentials:**

- **Employers**: `employer1@example.com` to `employer25@example.com`
- **Job Seekers**: `jobseeker1@example.com` to `jobseeker50@example.com`
- **Password**: `Password123!` (for all accounts)

## Common Issues & Fixes

### Port Conflicts

If ports 5173 or 3000 are already in use:

```bash
# Check what's using the ports
lsof -i :5173
lsof -i :3000

# Kill processes or edit docker-compose.yml for different ports
```

### Frontend Can't Connect to Backend

1. Ensure backend is running: `http://localhost:3000/api/health`
2. Check API proxy configuration in `apps/frontend/vite.config.ts`
3. Verify `VITE_API_URL` environment variable

## 📚 Documentation

- **[Complete Features Overview](docs/features.md)** - Detailed breakdown of all application functionality and capabilities
- **[Design Architecture](docs/design.md)** - Comprehensive design decisions, database schema, authentication strategy, and architectural choices
- **[OAuth Setup Guide](docs/oauth-setup.md)** - Step-by-step Google OAuth2 configuration and troubleshooting
- **[SSO Authentication](docs/sso.md)** - Complete guide to Google OAuth implementation and flow
- **[Backend API](apps/backend/README.md)** - API documentation and backend setup
- **[Frontend Guide](apps/frontend/README.md)** - React application documentation

## 🏗️ Key Design Decisions

This job board application follows modern full-stack principles with careful attention to security, scalability, and developer experience:

### Database Schema

- **Hybrid user model** supporting both password-based and SSO authentication
- **Role-based architecture** with separate profiles for job seekers and employers
- **Strategic indexing** for optimal query performance
- **UUID strategy** for public-facing identifiers with internal serial PKs

### Authentication Strategy

- **JWT tokens** stored in HttpOnly cookies for XSS protection
- **Dual authentication support**: Traditional password + Google OAuth2
- **Role confirmation system** allows deferred role selection during SSO signup
- **Account linking** connects SSO logins to existing email accounts

### OAuth2 Integration - Google

**Why Google?** Ubiquitous adoption, excellent security standards, and enterprise-ready implementation.

- **Server-side token exchange** keeps client secrets secure
- **Dynamic redirect URIs** for flexible deployment environments
- **State-based role passing** for seamless user experience
- **Comprehensive error handling** with user-friendly feedback

### Architectural Choices

**Backend:**

- **Modular Express.js** with feature-based organization
- **Repository pattern** for clean data access layer
- **Drizzle ORM** for type-safe, lightweight database operations
- **Middleware-driven security** (helmet, cors, rate limiting, input validation)

**Frontend:**

- **React 18 + TypeScript** for type safety and modern development
- **Redux Toolkit** for predictable state management
- **Module-based architecture** with co-located feature concerns
- **Vite** for lightning-fast development experience

For detailed explanations of these decisions and their rationale, see the [Design Architecture Documentation](docs/design.md).

## 🔧 Code Quality & Development Scripts

This project uses ESLint and Prettier for code quality and formatting, with automatic pre-commit hooks via Husky.

### Available Scripts

```bash
# Run ESLint on all TypeScript files
bun run lint

# Run markdownlint on all markdown files
bun run lint:md

# Format all files with Prettier
bun run format
```

### Code Quality Checks

Always ensure your code passes quality checks:

```bash
# Auto-fix linting issues
bun run format:all

# fixing markdown issues
bun run lint:md:fix

# Or let pre-commit hooks handle it automatically
git add . && git commit -m "your message"
```

#### Pre-commit Hooks

The project automatically runs code quality checks before each commit:

- ESLint with auto-fix
- Markdownlint with auto-fix
- Prettier formatting
- Only staged files are processed

### Troubleshooting

- If port conflicts occur, edit the port mappings in `docker-compose.yml`
- For database connection issues, ensure the backend waits for the database health check
- Backend code changes are automatically reflected due to volume mounting and `bun --watch`
