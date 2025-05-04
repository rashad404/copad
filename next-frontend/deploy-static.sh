#!/bin/bash

# Next.js Static Export Deployment Script
# This script handles the deployment of a Next.js application as a static site
# Use this if you're not running a Node.js server in production

# Exit on error
set -e

echo "Starting Next.js static deployment process..."

# Pull latest changes from git repository
echo "Pulling latest changes from repository..."
cd /home/copad/copad
git pull

# Navigate to the Next.js project directory
echo "Navigating to Next.js project directory..."
cd /home/copad/copad/next-frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the Next.js application with static export
echo "Building Next.js application with static export..."
npm run build

# Copy the static export to the web server's public directory
echo "Copying static files to public_html..."
\cp -rf out/* /home/copad/public_html/

echo "Static deployment completed successfully!"