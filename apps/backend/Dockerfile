FROM oven/bun:latest
WORKDIR /app

# adguments
ARG PORT=3000

# Copy package files (optimized for layer caching)
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/types/package.json ./packages/shared/types/

# Copy shared types source (needed for local package resolution)
COPY packages/shared/types ./packages/shared/types

# Build shared types package first
WORKDIR /app/packages/shared/types
RUN bun install && bun run build

# Go back to root and install all dependencies
WORKDIR /app
RUN bun install --frozen-lockfile

# Copy source code (exclude unnecessary files via .dockerignore)
COPY apps/backend ./apps/backend

# Set working directory to backend app
WORKDIR /app/apps/backend

# Create uploads directory with proper permissions
RUN mkdir -p uploads/resumes && chmod -R 755 uploads

# Expose port
EXPOSE ${PORT}
ENV PORT=${PORT}
CMD ["bun", "--watch", "src/server.ts"]