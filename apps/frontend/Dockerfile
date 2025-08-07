FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN bun install

# Copy all source files
COPY . .

# Create non-root user and set permissions
RUN addgroup -g 1001 bunjs && \
    adduser -u 1001 -G bunjs -D bunuser && \
    chown -R bunuser:bunjs /app

# Switch to non-root user
USER bunuser

# Expose port and start dev server
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]