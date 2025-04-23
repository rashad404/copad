import { createContext, useContext, useEffect, useState } from "react";

const SiteContext = createContext();

// Define configs ONCE
const siteConfigs = {
    "virtualhekim.az": { AGENT_NAME: "VirtualHekim", WEBSITE_NAME: "VirtualHekim", logo: "/logos/virtualhekim.png", WEBSITE_TLD: ".az" },
    "azdoc.ai": { AGENT_NAME: "AzDoc", WEBSITE_NAME: "AzDoc", logo: "/logos/azdoc.png", WEBSITE_TLD: ".ai" },
    "localhost": { AGENT_NAME: "Localhost", WEBSITE_NAME: "Localhost", logo: "/logos/default.png", WEBSITE_TLD: ".dev" },
  };
  

function resolveSiteInfo() {
  const hostname = window.location.hostname;
  return siteConfigs[hostname] || { title: "Default", logo: "/logos/default.png" };
}

export function SiteProvider({ children }) {
  const [siteInfo, setSiteInfo] = useState(resolveSiteInfo);

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
  return useContext(SiteContext);
}

export { resolveSiteInfo as getSiteInfo }; // for i18n.js
