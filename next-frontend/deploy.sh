#!/bin/bash

# Next.js Deployment Script
# This script handles the deployment of a Next.js application to production
# It assumes you have Node.js and npm installed on the server

# Exit on error
set -e

echo "Starting Next.js deployment process..."

# Pull latest changes from git repository
echo "Pulling latest changes from repository..."
cd /home/copad/copad
git pull

# Navigate to the Next.js project directory
echo "Navigating to Next.js project directory..."
cd /home/copad/copad/next-frontend

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Stop the existing Next.js server if it's running
echo "Stopping existing Next.js server (if running)..."
pm2 stop nextjs-copad 2>/dev/null || true

# Start the Next.js server with PM2
echo "Starting Next.js server with PM2..."
pm2 start npm --name "nextjs-copad" -- start

# Save the PM2 process list so it starts on reboot
echo "Saving PM2 process list..."
pm2 save

echo "Deployment completed successfully!"