# Multi-stage Dockerfile to combine React frontend, Express backend, and nginx
FROM node:18-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Clear npm cache and remove node_modules if they exist
RUN npm cache clean --force

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Production stage
FROM nginx:alpine

# Install Node.js in the nginx container
RUN apk add --no-cache nodejs npm

# Create app directory for Express
WORKDIR /app

# Copy built Express backend from builder stage
COPY --from=builder /app/.local/express/dist ./backend

# Copy built React frontend to nginx serve directory
COPY --from=builder /app/.local/vite/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a startup script that runs both nginx and Express
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80 for nginx
EXPOSE 80

# Start both nginx and Express using the startup script
CMD ["/start.sh"]