# Environment Setup Guide

This guide explains how to configure the mobile app to work with different backend environments.

## Quick Start

### For Local Development (Default)
The app is configured to use your local backend by default. No changes needed unless your IP address is different.

### To Switch to Production
1. Open `src/config/environment.ts`
2. Change line 7:
   ```typescript
   const CURRENT_ENV: Environment = 'production';
   ```
3. Restart the app

## Configuration File Location
All environment configuration is in: `src/config/environment.ts`

## Key Features

### 1. Easy Environment Switching
- Single variable to change: `CURRENT_ENV`
- No need to update multiple files
- Clear separation between local and production settings

### 2. Automatic URL Conversion
When using local development:
- API calls go to your local backend
- File URLs sent to OpenAI are automatically converted to production URLs
- This prevents "localhost not accessible" errors from external services

### 3. Environment-Specific Settings
```typescript
local: {
  apiBaseUrl: 'http://192.168.1.105:8080',    // Your local backend
  publicApiUrl: 'https://api.azdoc.app',      // Public URL for external services
}
```

## Common Scenarios

### Scenario 1: Testing with Local Backend
- Keep `CURRENT_ENV = 'local'`
- Upload files normally
- Files will be uploaded to local backend
- URLs sent to OpenAI will use production domain

### Scenario 2: Testing with Production Backend
- Change to `CURRENT_ENV = 'production'`
- All API calls go to production
- Use carefully to avoid affecting real data

### Scenario 3: Different Local IP
If your machine has a different IP:
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update in `environment.ts`:
   ```typescript
   apiBaseUrl: 'http://YOUR_IP:8080',
   ```

## Troubleshooting

### "Network Error" when uploading files
- Check your local IP is correct
- Ensure backend is running on port 8080
- Verify CORS is configured for your IP

### "OpenAI cannot access localhost" errors
- This should not happen with the new configuration
- If it does, check that `replaceLocalhostUrl` is being called in `fileService.ts`

### Files not displaying after upload
- Check the console for URL replacement logs
- Verify production URL is accessible
- Ensure file permissions are correct on backend

## Benefits of This Approach

1. **No Backend Changes Needed**: Backend can return localhost URLs; mobile app handles conversion
2. **Easy Testing**: Switch between environments without code changes
3. **Production Safety**: Clear separation prevents accidental production changes
4. **External Service Compatibility**: Files work with OpenAI regardless of environment

## Example Usage

```typescript
// The configuration automatically handles URL conversion
// Original URL from backend: http://localhost:8080/uploads/image.jpg
// Converted URL for OpenAI: https://api.azdoc.app/uploads/image.jpg
```

This ensures that OpenAI can always access uploaded files, even during local development.