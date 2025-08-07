FROM oven/bun:latest
WORKDIR /app

# Copy package.json first for better caching
COPY apps/backend/package.json ./apps/backend/
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser

# Change ownership of the app directory
RUN chown -R bunuser:nodejs /app
USER bunuser

# Expose port (configurable via ENV)
EXPOSE 3000

# Set working directory to backend app
WORKDIR /app/apps/backend

# Default command for development with hot reload
CMD ["bun", "--watch", "src/index.ts"]