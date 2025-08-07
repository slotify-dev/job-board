FROM node:20-alpine
WORKDIR /app

# 1. Install required dependencies (including bash)
RUN apk add --no-cache bash unzip curl

# 2. Install Bun using official method
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# 3. Verify installation
RUN bun --version

# 4. Copy package files (optimized for caching)
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

# 5. Install dependencies
RUN bun install --frozen-lockfile

# 6. Copy remaining files
COPY . .

# 7. Create non-root user (Alpine-compatible syntax)
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -D bunuser && \
    chown -R bunuser:nodejs /app

# 8. set user and work directory 
USER bunuser
WORKDIR /app/apps/frontend

EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]