# Building and Deploying from Your Local Machine

If you're having issues building directly on the server, you can build the Next.js app locally and upload the generated files.

## Step 1: Build Locally

1. On your local development machine, navigate to your project:
   ```bash
   cd /path/to/next-frontend
   ```

2. Make sure you have the latest code:
   ```bash
   git pull
   ```

3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

   This will generate an `out` directory with static HTML files.

## Step 2: Upload to Server

You can use SCP, SFTP, or any file transfer method to upload the files:

### Using SCP:
```bash
scp -r out/* username@your-server:/home/copad/public_html/
```

### Using SFTP:
Use an SFTP client like FileZilla to upload the contents of the `out` directory to `/home/copad/public_html/` on your server.

## Step 3: Set Up .htaccess on the Server

Connect to your server via SSH:
```bash
ssh username@your-server
```

Create a proper .htaccess file for Next.js:
```bash
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
```

## Step 4: Set Proper Permissions

Finally, set the appropriate permissions:
```bash
chmod -R 755 /home/copad/public_html
find /home/copad/public_html -type f -exec chmod 644 {} \;
```

## Troubleshooting

If you encounter any issues:

1. Check that the exported files include all necessary assets (JavaScript, CSS, images)
2. Verify the .htaccess file is properly configured
3. Check your server's error logs for any issues
4. Make sure the file permissions are set correctly