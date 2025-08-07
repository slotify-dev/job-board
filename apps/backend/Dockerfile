FROM oven/bun:latest

WORKDIR /app

# Copy package.json and bun.lockb (if it exists)
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

# Expose port
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["bun", "run", "dev"]