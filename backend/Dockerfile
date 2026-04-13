# Use a Node.js base image that includes OpenJDK and Python
FROM node:20-bullseye

# Install Java (OpenJDK 17) and Python 3
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set JAVA and PYTHON paths
ENV JAVA_PATH=/usr/bin/java
ENV JAVAC_PATH=/usr/bin/javac
ENV PYTHON_PATH=/usr/bin/python3

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
