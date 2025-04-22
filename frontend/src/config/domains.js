export const DOMAINS = {
  COPAD: 'copad.ai',
  VIRTUALHEKIM: 'virtualhekim.az',
  AZDOC: 'azdoc.ai',
  LOGMAN: 'logman.az'
};

// Get the current domain from window.location
export const getCurrentDomain = () => {
  return window.location.hostname;
};

// Get the API URL based on the current domain
export const getApiUrl = () => {
  const currentDomain = getCurrentDomain();
  
  // If we're in development, use the development API URL
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL;
  }

  // Map domains to their respective API URLs
  const domainToApiUrl = {
    [DOMAINS.COPAD]: `https://${DOMAINS.COPAD}/api`,
    [DOMAINS.VIRTUALHEKIM]: `https://${DOMAINS.VIRTUALHEKIM}/api`,
    [DOMAINS.AZDOC]: `https://${DOMAINS.AZDOC}/api`,
    [DOMAINS.LOGMAN]: `https://${DOMAINS.LOGMAN}/api`
  };

  // Return the corresponding API URL or fallback to the current domain
  return domainToApiUrl[currentDomain] || `https://${currentDomain}/api`;
}; 