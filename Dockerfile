# Multi-stage build for production

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy client source
COPY client/ ./

# Build frontend
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-build

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Stage 3: Production image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy backend from build stage
COPY --from=backend-build --chown=nodejs:nodejs /app/server ./server

# Copy frontend build from build stage
COPY --from=frontend-build --chown=nodejs:nodejs /app/client/dist ./client/dist

# Create directories for uploads, PDFs, and logs
RUN mkdir -p /app/server/uploads /app/server/pdfs /app/server/logs && \
    chown -R nodejs:nodejs /app/server/uploads /app/server/pdfs /app/server/logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set working directory to server
WORKDIR /app/server

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "src/index.js"]

