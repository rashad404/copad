// Environment configuration
// Change CURRENT_ENV to switch between environments

type Environment = 'local' | 'production';

// CHANGE THIS TO SWITCH ENVIRONMENTS
const CURRENT_ENV: Environment = 'local';

interface EnvironmentConfig {
  apiBaseUrl: string;
  publicApiUrl: string; // URL that external services (like OpenAI) can access
  websocketUrl?: string;
  environment: Environment;
}

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    apiBaseUrl: 'http://192.168.1.105:8080', // Your local IP
    publicApiUrl: 'https://azdoc.ai', // Production URL for external access
    websocketUrl: 'ws://192.168.1.105:8080',
    environment: 'local',
  },
  production: {
    apiBaseUrl: 'https://azdoc.ai',
    publicApiUrl: 'https://azdoc.ai',
    websocketUrl: 'wss://azdoc.ai',
    environment: 'production',
  },
};

export const ENV = environments[CURRENT_ENV];

// Helper to determine if we're in local development
export const isLocalDevelopment = () => ENV.environment === 'local';

// Helper to get the appropriate URL for external services
export const getPublicUrl = (path: string) => {
  return `${ENV.publicApiUrl}${path}`;
};

// Helper to replace localhost URLs with public URLs
export const replaceLocalhostUrl = (url: string): string => {
  if (!url) return url;
  
  // Replace various localhost patterns
  const localhostPatterns = [
    /http:\/\/localhost:\d+/g,
    /http:\/\/127\.0\.0\.1:\d+/g,
    /http:\/\/192\.168\.\d+\.\d+:\d+/g,
  ];
  
  let replacedUrl = url;
  for (const pattern of localhostPatterns) {
    replacedUrl = replacedUrl.replace(pattern, ENV.publicApiUrl);
  }
  
  return replacedUrl;
};

// Export individual config values for convenience
export const API_BASE_URL = ENV.apiBaseUrl;
export const PUBLIC_API_URL = ENV.publicApiUrl;
export const WEBSOCKET_URL = ENV.websocketUrl;

console.log('🔧 Environment Config:', {
  environment: CURRENT_ENV,
  apiBaseUrl: ENV.apiBaseUrl,
  publicApiUrl: ENV.publicApiUrl,
});