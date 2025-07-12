# Dockerfile for Analytics Service
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./
RUN npm install

# Copy service code
COPY . .

# Expose the service port
EXPOSE 3002

# Start the service
CMD ["npm", "start"]
