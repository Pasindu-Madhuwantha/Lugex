# Dockerfile for Order Service
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the entire service code
COPY . .

# Expose the service port
EXPOSE 3003

# Start the order service
CMD ["npm", "start"]
