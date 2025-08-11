FROM node:18-alpine
WORKDIR /app

# adguments
ARG PORT=5173

# 1. First copy only package files for better caching
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/types/package.json ./packages/shared/types/

# Copy shared types source (needed for local package resolution)
COPY packages/shared/types ./packages/shared/types

# Build shared types package first
WORKDIR /app/packages/shared/types
RUN npm install && npm run build

# Go back to root and install all dependencies
WORKDIR /app
RUN npm install

# 3. Copy all frontend app files
COPY apps/frontend/ ./apps/frontend/

# Set working directory to frontend app
WORKDIR /app/apps/frontend

# Expose port
EXPOSE ${PORT}
ENV PORT=${PORT}
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]