# Stage 1 - Build Frontend
FROM node:20-alpine AS frontend
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy modified vite config (without wayfinder)
COPY vite.config.build.ts ./vite.config.ts

# Copy ALL source files including hidden ones
COPY resources ./resources/
COPY public ./public/

# Debug: Check if routes folder exists
RUN ls -la /app/resources/js/ && \
    echo "=== Routes folder contents ===" && \
    ls -la /app/resources/js/routes/ 2>/dev/null || echo "Routes folder not found" && \
    echo "=== Index.ts exists? ===" && \
    ls -la /app/resources/js/routes/index.ts 2>/dev/null || echo "index.ts not found"

# Install and build
RUN npm ci
RUN npm run build
