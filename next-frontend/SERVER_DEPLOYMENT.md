# Next.js Server Deployment Guide

This guide provides instructions for deploying your Next.js application in server-side rendering (SSR) mode using Node.js and PM2.

## Prerequisites

- Node.js (v16 or newer) installed on your server
- PM2 process manager installed globally (`npm install -g pm2`)
- Nginx or Apache as a reverse proxy (recommended)

## Deployment Steps

1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

   This script will:
   - Pull the latest code from your git repository
   - Fix the PostCSS configuration if needed
   - Install dependencies
   - Build the Next.js application
   - Start the server using PM2

## Web Server Configuration (Nginx)

Next.js in SSR mode requires a web server like Nginx to act as a reverse proxy. Copy and customize the example configuration:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/your-site
sudo nano /etc/nginx/sites-available/your-site  # Edit as needed
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl restart nginx
```

## Troubleshooting

### Checking PM2 Status and Logs

```bash
# Check status of the Next.js application
pm2 status

# View logs
pm2 logs nextjs-copad

# View detailed information
pm2 show nextjs-copad
```

### Common Issues

1. **Port in use**:
   If port 3000 is already in use, modify the Next.js start command in package.json:
   ```json
   "start": "next start -p 3001"
   ```
   And update your Nginx configuration accordingly.

2. **Permission issues**:
   Ensure your Node.js process has read/write permissions for the necessary directories.

3. **Dependencies issues**:
   If you encounter errors with specific dependencies, you can try:
   ```bash
   npm install --force
   ```

4. **Proxy issues**:
   Verify that Nginx is correctly configured to proxy requests to your Next.js application.

## Monitoring and Maintenance

- **Monitor the application**: `pm2 monit`
- **Update the application**: Run `./deploy.sh` again
- **Restart the application**: `pm2 restart nextjs-copad`
- **Stop the application**: `pm2 stop nextjs-copad`

## Scaling (Optional)

To run multiple instances of your application for better performance:

```bash
pm2 scale nextjs-copad 2  # Run 2 instances
```

Adjust your Nginx configuration to load balance between instances if needed.