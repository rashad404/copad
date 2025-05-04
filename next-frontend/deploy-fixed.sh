#!/bin/bash

# Next.js Static Export Deployment Script (Fixed for Tailwind)
# This script handles the deployment of a Next.js application as a static site

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

# Install dependencies with tailwind and autoprefixer explicitly
echo "Installing dependencies..."
npm install tailwindcss autoprefixer --save-dev
npm ci

# Build the Next.js application with static export
echo "Building Next.js application with static export..."
npm run build

# Make sure out directory exists
if [ ! -d "out" ]; then
  echo "Error: Output directory 'out' was not created. Build may have failed."
  exit 1
fi

# Create backup of existing public_html
echo "Creating backup of existing public_html..."
timestamp=$(date +%Y%m%d%H%M%S)
if [ -d "/home/copad/public_html" ]; then
  mkdir -p /home/copad/backups
  tar -czf "/home/copad/backups/public_html_backup_$timestamp.tar.gz" /home/copad/public_html
fi

# Copy the static export to the web server's public directory
echo "Copying static files to public_html..."
mkdir -p /home/copad/public_html
\cp -rf out/* /home/copad/public_html/

# Create a Next.js-compatible .htaccess file
echo "Creating Next.js compatible .htaccess file..."
cat > "/home/copad/public_html/.htaccess" << EOL
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # If the request is not for a file or directory, try the same URL with .html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^([^.]+)$ /$1.html [L]
  
  # If the .html file doesn't exist either, redirect to 404.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ /404.html [L]
</IfModule>
EOL

echo "Setting proper permissions..."
chmod -R 755 /home/copad/public_html
find /home/copad/public_html -type f -exec chmod 644 {} \;

echo "Static deployment completed successfully!"
echo "Backup created at: /home/copad/backups/public_html_backup_$timestamp.tar.gz"