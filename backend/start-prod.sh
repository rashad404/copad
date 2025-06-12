#!/bin/bash

# Production startup script for Spring Boot application

# Load environment variables from .env.production file if it exists
if [ -f .env.production ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

# Build the application
echo "Building application..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Run the application with production profile
echo "Starting application with production profile..."
java -jar -Dspring.profiles.active=prod target/copad-0.0.1-SNAPSHOT.jar