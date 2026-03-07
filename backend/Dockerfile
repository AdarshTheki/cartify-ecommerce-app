# Use a smaller base image
FROM node:24-slim

# Set working directory
WORKDIR /app

# Install dependencies only (no dev dependencies in production)
COPY package*.json ./
RUN npm install --omit=dev

# Copy only necessary files
COPY . .

# Expose the backend port
EXPOSE 8000

# Start the server
CMD ["npm", "run", "start"]
