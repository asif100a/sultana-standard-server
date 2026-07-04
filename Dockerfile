# Use the official Node.js 20 slim image
FROM node:20-slim

# Install system dependencies (like openssl, often required by database/auth drivers)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY package.json bun.lock* ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose internal port 8080 (Fly.io default internal port)
EXPOSE 8080

# Set environment variables inside the container
ENV PORT=8080
ENV NODE_ENV=production

# Start the server
CMD ["npm", "run", "start"]
