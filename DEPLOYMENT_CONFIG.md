# Deployment Configuration for File Uploads

## Directory Structure

### Local Development
```
/projects/copad/
├── backend/          # Spring Boot backend
├── next-frontend/    # Next.js frontend
└── public_html/      # Static files served on port 8080
    └── uploads/
        ├── images/
        └── documents/
```

### Production (cPanel)
```
/home/copad/
├── copad/
│   ├── backend/      # Spring Boot backend
│   └── next-frontend/ # Next.js frontend
└── public_html/      # Web-accessible directory
    └── uploads/
        ├── images/
        └── documents/
```

## Environment Variables

### Backend (application.yml or .env)
```yaml
# For Local Development
upload:
  base-dir: ../public_html
  public-url: http://localhost:8080

# For Production
upload:
  base-dir: /home/copad/public_html
  public-url: https://yourdomain.com
```

Or as environment variables:
```bash
# Local
UPLOAD_BASE_DIR=../public_html
PUBLIC_URL=http://localhost:8080

# Production
UPLOAD_BASE_DIR=/home/copad/public_html
PUBLIC_URL=https://yourdomain.com
```

## Local Development Setup

1. Start the static file server for public_html:
```bash
npm run serve-public
```

2. Start the backend:
```bash
cd backend && ./mvnw spring-boot:run
```

3. Start the frontend:
```bash
cd next-frontend && npm run dev
```

Or run all at once from the root directory:
```bash
npm run dev
```

## Production Deployment Notes

1. **File Permissions**: Ensure the backend application has write permissions to `/home/copad/public_html/uploads/`

2. **Environment Variables**: Set the following in your production environment:
   - `UPLOAD_BASE_DIR=/home/copad/public_html`
   - `PUBLIC_URL=https://yourdomain.com`

3. **cPanel Configuration**: 
   - The `public_html` folder is automatically served by Apache/nginx
   - No additional configuration needed for serving static files
   - Uploaded files will be accessible at `https://yourdomain.com/uploads/`

4. **Security Considerations**:
   - Consider adding .htaccess rules to prevent directory listing
   - Implement file type restrictions if needed
   - Monitor disk usage for the uploads directory

## File Access URLs

- **Local**: `http://localhost:8080/uploads/images/filename.jpg`
- **Production**: `https://yourdomain.com/uploads/images/filename.jpg`

The system automatically handles URL generation based on the `PUBLIC_URL` environment variable.