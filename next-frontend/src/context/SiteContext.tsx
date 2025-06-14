'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { siteConfig, type SiteInfo } from './siteConfig';

// Client-side hook that uses React hooks
function useSiteInfo(): SiteInfo {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(siteConfig.getDefaultSiteInfo());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setSiteInfo(siteConfig.getSiteInfoByHostname(hostname));
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

// Re-export for backward compatibility
export const getInitialSiteInfo = siteConfig.getDefaultSiteInfo;
export const getSiteInfo = siteConfig.getSiteInfoByHostname;