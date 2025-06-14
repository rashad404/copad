// This file contains site configuration that can be imported from both server and client components

export interface SiteInfo {
  AGENT_NAME: string;
  WEBSITE_NAME: string;
  logo: string;
  WEBSITE_TLD: string;
}

const siteConfigs: Record<string, SiteInfo> = {
  'virtualhekim.az': { AGENT_NAME: 'VirtualHekim', WEBSITE_NAME: 'VirtualHekim', logo: '/logos/virtualhekim.png', WEBSITE_TLD: '.az' },
  'azdoc.ai': { AGENT_NAME: 'AzDoc', WEBSITE_NAME: 'AzDoc', logo: '/logos/azdoc.png', WEBSITE_TLD: '.ai' },
  'localhost': { AGENT_NAME: 'Localhost', WEBSITE_NAME: 'Localhost', logo: '/logos/default.png', WEBSITE_TLD: '.dev' },
};

// Default fallback site info
const DEFAULT_SITE = siteConfigs['azdoc.ai'];

/**
 * Gets site info by hostname
 * Safe to use in both server and client components
 */
function getSiteInfoByHostname(hostname?: string): SiteInfo {
  if (!hostname) return DEFAULT_SITE;
  return siteConfigs[hostname] || DEFAULT_SITE;
}

/**
 * Returns the default site info
 * Safe to use in both server and client components
 */
function getDefaultSiteInfo(): SiteInfo {
  return DEFAULT_SITE;
}

export const siteConfig = {
  getSiteInfoByHostname,
  getDefaultSiteInfo,
};