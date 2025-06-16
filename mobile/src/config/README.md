# Environment Configuration

This folder contains environment-specific configuration for the mobile app.

## Switching Between Environments

To switch between local and production environments:

1. Open `src/config/environment.ts`
2. Change the `CURRENT_ENV` variable at the top of the file:

```typescript
// For local development
const CURRENT_ENV: Environment = 'local';

// For production
const CURRENT_ENV: Environment = 'production';
```

## Configuration Details

### Local Environment
- Uses your local backend (e.g., `http://192.168.1.105:8080`)
- File URLs are automatically converted to production URLs for external services (OpenAI)
- Good for development and testing

### Production Environment
- Uses the production backend (`https://api.azdoc.app`)
- All URLs point to production
- Use this when building for release

## Important Notes

1. **Local IP Address**: When using local environment, make sure to update the IP address in `environment.ts` to match your machine's IP address.

2. **File URLs**: When in local mode, uploaded file URLs are automatically converted from localhost to the production URL when sent to external services like OpenAI. This prevents errors where OpenAI cannot access localhost URLs.

3. **Environment Variables**: The `.env` file is still used for some configurations, but the main environment switching happens in `environment.ts`.

## Adding New Environments

To add a new environment (e.g., staging):

1. Add the new environment type:
```typescript
type Environment = 'local' | 'production' | 'staging';
```

2. Add the configuration:
```typescript
staging: {
  apiBaseUrl: 'https://staging-api.azdoc.app',
  publicApiUrl: 'https://staging-api.azdoc.app',
  websocketUrl: 'wss://staging-api.azdoc.app',
  environment: 'staging',
},
```

3. Update `CURRENT_ENV` to use the new environment.