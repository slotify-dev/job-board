FROM oven/bun:alpine
WORKDIR /app

# adguments
ARG PORT=5173

# Set Bun cache directory
ENV BUN_INSTALL_CACHE=/app/.bun-cache

# 1. First copy only package files for better caching
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

# 2. Install dependencies
RUN bun install --frozen-lockfile

# 3. Copy source code (exclude unnecessary files via .dockerignore)
COPY apps/frontend ./apps/frontend

# Set working directory to backend app
WORKDIR /app/apps/frontend

# Expose port
EXPOSE ${PORT}
ENV PORT=${PORT}
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]