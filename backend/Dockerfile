# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first (to leverage Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Run the seed script and start the backend
CMD sh -c "npm run seed && npm start"
