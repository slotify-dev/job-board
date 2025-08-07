FROM oven/bun:alpine
ARG PORT=3000
WORKDIR /app

# Set Bun cache directory
ENV BUN_INSTALL_CACHE=/app/.bun-cache

# 1. First copy only package files for better caching
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

# 2. Install dependencies
RUN bun install --frozen-lockfile

# 3. Copy source code (exclude unnecessary files via .dockerignore)
COPY apps/frontend ./apps/frontend

# Create non-root user (combined for single layer)
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunuser && \
    chown -R bunuser:bunjs /app

# Expose port (configurable via ENV)
EXPOSE ${PORT}
ENV PORT=${PORT}

# Set working directory to backend app
USER bunuser
WORKDIR /app/apps/frontend

CMD ["bun", "run", "dev", "--host", "0.0.0.0"]