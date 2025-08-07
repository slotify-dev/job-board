FROM node:20-alpine
WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy package.json first for better caching
COPY apps/frontend/package.json ./apps/frontend/
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bunuser -u 1001

# Change ownership of the app directory
RUN chown -R bunuser:nodejs /app
USER bunuser

# Expose Vite dev server port
EXPOSE 5173

# Set working directory to frontend app
WORKDIR /app/apps/frontend

# Default command for development with hot reload
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]