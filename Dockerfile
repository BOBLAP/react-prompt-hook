
# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npm install express

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --production
RUN npm install express

# Copy built files and server
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/server ./src/server

# Expose port 80
EXPOSE 80

# Start server
CMD ["node", "src/server/index.js"]
