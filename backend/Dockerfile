# Use a smaller base image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies only (no dev dependencies in production)
COPY package*.json ./
RUN npm install 

# Copy only necessary files
COPY . .

# Expose the backend port
EXPOSE 80

# Start the server
CMD ["npm", "run", "start"]
