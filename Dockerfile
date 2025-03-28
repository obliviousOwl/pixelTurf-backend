# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev  # Only install production dependencies

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Set environment variable for Cloud Run
ENV PORT=8080

# Start the server
CMD ["node", "index.js"]
