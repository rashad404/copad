import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface SiteInfo {
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

function getInitialSiteInfo(): SiteInfo {
  // Default for SSR
  return siteConfigs['azdoc.ai'];
}

function useSiteInfo(): SiteInfo {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(getInitialSiteInfo());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setSiteInfo(siteConfigs[hostname] || siteConfigs['azdoc.ai']);
    }
  }, []);

  return siteInfo;
}

const SiteContext = createContext<SiteInfo | undefined>(undefined);

export const SiteContextProvider = ({ children }: { children: ReactNode }) => {
  const siteInfo = useSiteInfo();
  return (
    <SiteContext.Provider value={siteInfo}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }
  return context;
};

export { getInitialSiteInfo as getSiteInfo }; // for i18n and other files