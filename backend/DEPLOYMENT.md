# Production Deployment Guide

## Prerequisites
- Java 21 or higher installed on the server
- MySQL database running
- Environment variables configured

## Deployment Steps

### 1. Set up environment variables

Create a `.env.production` file on your production server at `/home/copad/copad/backend/.env.production` with the following variables:

```bash
DATABASE_URL=jdbc:mysql://localhost:3306/drcopad?useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
OPENAI_API_KEY=your-openai-api-key
```

### 2. Deploy the code

```bash
cd /home/copad/copad/backend
git pull origin main
```

### 3. Build and run

```bash
# Using the production start script
./start-prod.sh

# Or manually:
./mvnw clean package -DskipTests
java -jar -Dspring.profiles.active=prod target/copad-0.0.1-SNAPSHOT.jar
```

### 4. Run as a background service (recommended)

Create a systemd service file `/etc/systemd/system/copad.service`:

```ini
[Unit]
Description=Copad Spring Boot Application
After=syslog.target

[Service]
User=copad
WorkingDirectory=/home/copad/copad/backend
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /home/copad/copad/backend/target/copad-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
StandardOutput=append:/home/copad/copad/backend/app.log
StandardError=append:/home/copad/copad/backend/app-error.log
EnvironmentFile=/home/copad/copad/backend/.env.production

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```bash
sudo systemctl enable copad
sudo systemctl start copad
sudo systemctl status copad
```

### 5. Using screen (alternative to systemd)

If you prefer using screen:

```bash
screen -S copad
cd /home/copad/copad/backend
./start-prod.sh
# Press Ctrl+A, then D to detach

# To reattach:
screen -r copad
```

## File Storage

Files are stored in `/home/copad/public_html/uploads/`:
- Images: `/home/copad/public_html/uploads/images/`
- Documents: `/home/copad/public_html/uploads/documents/`

These are automatically served by the application at:
- `https://virtualhekim.az/uploads/images/*`
- `https://virtualhekim.az/uploads/documents/*`

## Important Notes

1. The production configuration uses:
   - Profile: `prod` (activated by `-Dspring.profiles.active=prod`)
   - Config file: `application-prod.yml`
   - Upload directory: `/home/copad/public_html`

2. Database migrations run automatically on startup with `ddl-auto: update`

3. Logs are set to INFO level in production to reduce verbosity

4. The application runs on port 8080 by default (can be changed with PORT environment variable)

## Monitoring

Check application logs:
```bash
# If using systemd
sudo journalctl -u copad -f

# If using screen or direct run
tail -f /home/copad/copad/backend/app.log
```

## Stopping the application

```bash
# If using systemd
sudo systemctl stop copad

# If using screen
screen -r copad
# Press Ctrl+C

# If running directly
# Find the process
ps aux | grep java | grep copad
# Kill the process
kill <PID>
```