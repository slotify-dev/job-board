# Job Board Application

This monorepo provides a complete full-stack development environment using Docker with hot reload for both frontend and backend.
It is designed for a Job Board Application app.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (only requirements!)

## One-Line Setup

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

# Kill processes or edit docker-compose.yml to use different ports
```

### Frontend Can't Connect to Backend

1. Ensure backend is running: `http://localhost:3000/api/health`
2. Check API proxy configuration in `apps/frontend/vite.config.ts`
3. Verify `VITE_API_URL` environment variable

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
