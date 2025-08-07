# 🛠 Local Development with Docker

This setup provides a complete development environment with PostgreSQL database for database management, and the
backend API service.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Bun](https://bun.sh) (for local development without Docker)

## Setup Steps

```bash
# clone the repository first
git clone <your-repo>

# go to project root dir
cd job-board

# install all dependencies
bun install

# copy env file
# update env file with some test credentials
cp apps/backend/.env.example apps/backend/.env

# run local dev env with docker setup
docker-compose up -d --build

# to stop docker services
docker-compose down
```

### Accessing Services

- **Backend API**: <http://localhost:3000>
  - Health check: <http://localhost:3000/api/health>
  - API root: <http://localhost:3000/>

### Connecting to Database

1. Open choice of your database tool i.e. Beekeper, sqlpro
2. Login with credentials above
3. Add a new server with these settings:
   - **Name**: Job Board DB
   - **Host**: `db` (service name in Docker network)
   - **Port**: `5432`
   - **Database**: `jobboard`
   - **Username**: `jobboard_user`
   - **Password**: `jobboard_password`

### Development Workflow

- **View logs**: `docker-compose logs -f backend`
- **Restart backend only**: `docker-compose restart backend`
- **Access backend container**: `docker-compose exec backend sh`
- **Run database migrations**: `docker-compose exec backend bun run migrate`

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
