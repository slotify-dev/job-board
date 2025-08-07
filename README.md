# 🛠 Local Development with Docker

This setup provides a complete development environment with PostgreSQL database for database management, and the backend API service.

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

### Troubleshooting

- If port conflicts occur, edit the port mappings in `docker-compose.yml`
- For database connection issues, ensure the backend waits for the database health check
- Backend code changes are automatically reflected due to volume mounting and `bun --watch`
