#!/bin/bash

# Production startup script with nohup for background execution

# Change to the backend directory
cd /home/copad/copad/backend

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

# Stop any running instance
echo "Stopping any running instances..."
pkill -f "copad.*\.jar" || true

# Wait a moment for the process to stop
sleep 2

# Run the application with nohup in background
echo "Starting application with nohup in background..."
nohup java -jar -Dspring.profiles.active=prod target/copad-*.jar > app.log 2>&1 &

# Get the PID
echo $! > app.pid

echo "Application started with PID: $(cat app.pid)"
echo "Logs are being written to: app.log"
echo "To monitor logs: tail -f app.log"