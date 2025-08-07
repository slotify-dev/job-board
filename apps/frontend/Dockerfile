FROM oven/bun:alpine
WORKDIR /app

# Copy package files (optimized for caching)
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy remaining files
COPY . .

# Create non-root user
RUN addgroup -g 1001 bunjs && \
    adduser -u 1001 -G bunjs -D bunuser && \
    chown -R bunuser:bunjs /app

# set working directory
USER bunuser
WORKDIR /app/apps/frontend

# expose port
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]