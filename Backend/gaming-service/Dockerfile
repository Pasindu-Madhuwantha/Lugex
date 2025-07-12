# Dockerfile for Game Service
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
