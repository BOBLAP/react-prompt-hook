
# Build stage
FROM node:20-alpine AS build

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npm install express better-sqlite3

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache ca-certificates python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --production
RUN npm install express better-sqlite3

# Copy built files and server
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/server ./src/server

# Create and set permissions for config directory
RUN mkdir -p /app/config && chmod 755 /app/config

# Expose port 80
EXPOSE 80

# Start server
CMD ["node", "src/server/index.js"]
