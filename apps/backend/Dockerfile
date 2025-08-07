FROM oven/bun:latest
ARG PORT=3000
WORKDIR /app

# Copy package files (optimized for layer caching)
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code (exclude unnecessary files via .dockerignore)
COPY apps/backend ./apps/backend

# Create non-root user (combined for single layer)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunuser && \
    chown -R bunuser:nodejs /app

# Expose port (configurable via ENV)
EXPOSE ${PORT}
ENV PORT=${PORT}

# Set working directory to backend app
USER bunuser
WORKDIR /app/apps/backend

# Default command for development with hot reload
CMD ["bun", "--watch", "src/server.ts"]