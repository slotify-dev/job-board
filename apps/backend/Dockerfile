FROM oven/bun:latest
WORKDIR /app

# adguments
ARG PORT=3000

# Copy package files (optimized for layer caching)
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code (exclude unnecessary files via .dockerignore)
COPY apps/backend ./apps/backend

# Set working directory to backend app
WORKDIR /app/apps/backend

# Expose port
EXPOSE ${PORT}
ENV PORT=${PORT}
CMD ["bun", "--watch", "src/server.ts"]