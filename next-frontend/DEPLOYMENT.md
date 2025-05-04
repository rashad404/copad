# NextJS Deployment Instructions

This document provides instructions for deploying the Next.js application to production.

## Deployment Options

There are two ways to deploy this Next.js application:

1. **Server-side Rendering (SSR) Mode** - Runs a Node.js server
2. **Static Export Mode** - Generates static HTML/CSS/JS files (similar to the old React deployment)

## Option 1: Server-side Rendering (SSR) Deployment

This method requires a Node.js server running on your host. It provides the full benefits of Next.js including server-side rendering, API routes, and middleware.

### Requirements:
- Node.js (v18 or newer) installed on your server
- PM2 or similar process manager installed (`npm install -g pm2`)

### Deployment Steps:

1. Make sure the deployment script has execute permissions:
   ```
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```
   ./deploy.sh
   ```

3. Configure your web server (Nginx or Apache) to proxy requests to your Next.js server:

   **Example Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000; # Next.js server port
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Option 2: Static Export Deployment

This method generates a fully static website that can be served by any web server without Node.js. This is similar to your previous React deployment approach.

### Limitations:
- No server-side rendering
- No API routes (/api/*)
- No middleware

### Deployment Steps:

1. Make sure the static deployment script has execute permissions:
   ```
   chmod +x deploy-static.sh
   ```

2. Run the static deployment script:
   ```
   ./deploy-static.sh
   ```

3. Your web server should already be configured to serve files from `/home/copad/public_html/`

## Troubleshooting

### If the SSR deployment isn't working:
- Check PM2 logs: `pm2 logs nextjs-copad`
- Verify Node.js version: `node -v`
- Check that the server is running: `pm2 status`

### If the static export isn't working:
- Check that all files were copied to public_html: `ls -la /home/copad/public_html/`
- Verify that the export completed successfully in the build output
- Check web server error logs