import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SiteInfo {
  AGENT_NAME?: string;
  WEBSITE_NAME?: string;
  logo?: string;
  WEBSITE_TLD?: string;
  title?: string;
}

const SiteContext = createContext<SiteInfo | undefined>(undefined);

const siteConfigs: Record<string, SiteInfo> = {
  'virtualhekim.az': { AGENT_NAME: 'VirtualHekim', WEBSITE_NAME: 'VirtualHekim', logo: '/logos/virtualhekim.png', WEBSITE_TLD: '.az' },
  'azdoc.ai': { AGENT_NAME: 'AzDoc', WEBSITE_NAME: 'AzDoc', logo: '/logos/azdoc.png', WEBSITE_TLD: '.ai' },
  'localhost': { AGENT_NAME: 'Localhost', WEBSITE_NAME: 'Localhost', logo: '/logos/default.png', WEBSITE_TLD: '.dev' },
};

function resolveSiteInfo(): SiteInfo {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return siteConfigs[hostname] || { title: 'Default', logo: '/logos/default.png' };
  }
  // Default for SSR
  return { title: 'Default', logo: '/logos/default.png' };
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(resolveSiteInfo);

  useEffect(() => {
    setSiteInfo(resolveSiteInfo());
  }, []);

  return (
    <SiteContext.Provider value={siteInfo}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteInfo() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSiteInfo must be used within a SiteProvider');
  return context;
}

export { resolveSiteInfo as getSiteInfo }; // for i18n and other files 