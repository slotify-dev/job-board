# 🧪 One-Step Dev Setup with Docker

This monorepo provides a complete full-stack development environment using Docker with hot reload for both frontend and backend.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (only requirements!)

## One-Line Setup

```bash
# Copy environment file and start all services
cp .env.example .env && docker-compose up --build
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

## Environment Configuration

The `.env` file contains all necessary environment variables:

```bash
# Database Configuration
PG_DB=jobboard
PG_USER=jobboard_user
PG_PASSWORD=jobboard_password

# Application Configuration
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://jobboard_user:jobboard_password@postgres:5432/jobboard

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

## Auto-Reloading Development

Both frontend and backend support hot reload out of the box:

- **Backend**: Uses `bun --watch` for instant restarts on file changes
- **Frontend**: Uses Vite dev server with HMR (Hot Module Replacement)
- **API Proxy**: Frontend automatically proxies `/api` requests to backend

## Database Connection

Connect to PostgreSQL using any database tool:

- **Host**: `localhost` (from host machine) or `postgres` (from containers)
- **Port**: `5432`
- **Database**: `jobboard`
- **Username**: `jobboard_user`
- **Password**: `jobboard_password`

## Development Workflow

```bash
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
```

## Common Issues & Fixes

### Port Conflicts

If ports 5173 or 3000 are already in use:

```bash
# Check what's using the ports
lsof -i :5173
lsof -i :3000

# Kill processes or edit docker-compose.yml to use different ports
```

### Docker Build Errors

```bash
# Clean build (removes cached layers)
docker-compose build --no-cache

# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Database Connection Issues

```bash
# Check database health
docker-compose exec postgres pg_isready -U jobboard_user -d jobboard

# Reset database
docker-compose down -v
docker-compose up --build
```

### Frontend Can't Connect to Backend

1. Ensure backend is running: `http://localhost:3000/api/health`
2. Check API proxy configuration in `apps/frontend/vite.config.ts`
3. Verify `VITE_API_URL` environment variable

## 🔧 Code Quality & Development Scripts

This project uses ESLint and Prettier for code quality and formatting, with automatic pre-commit hooks via Husky.

### Available Scripts

```bash
# Start both frontend and backend in development mode
bun run dev

# Run ESLint on all TypeScript files
bun run lint

# Run markdownlint on all markdown files
bun run lint:md

# Format all files with Prettier
bun run format

# Install dependencies for all workspaces
bun install
```

### Code Quality Checks

#### Manual Linting

```bash
# Check for linting errors
bun run lint

# Auto-fix linting issues
bunx eslint . --ext .ts,.tsx --fix

# Auto-fix markdown issues
bunx markdownlint-cli2 --fix '**/*.md' '!**/node_modules/**'

# Format code with Prettier
bun run format
```

#### Pre-commit Hooks

The project automatically runs code quality checks before each commit:

- ESLint with auto-fix
- Markdownlint with auto-fix
- Prettier formatting
- Only staged files are processed

#### ESLint Configuration

- **No `any` types**: Enforces explicit typing
- **Import ordering**: Automatic import organization
- **TypeScript strict rules**: Enhanced type checking
- **React best practices**: React-specific linting rules

#### Prettier Configuration

- **2-space indentation**
- **Single quotes**
- **Trailing commas**
- **80 character line width**

### Before Pushing Code

Always ensure your code passes quality checks:

```bash
# Run all checks
bun run lint && bun run lint:md && bun run format

# Or let pre-commit hooks handle it automatically
git add . && git commit -m "your message"
```

### Troubleshooting

- If port conflicts occur, edit the port mappings in `docker-compose.yml`
- For database connection issues, ensure the backend waits for the database health check
- Backend code changes are automatically reflected due to volume mounting and `bun --watch`
