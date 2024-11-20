# Use Node.js for development
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 for the Vite development server
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
