import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-08DD0QLDEX';

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics Script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Add gtag to window
    window.gtag = gtag;
  }, []);

  useEffect(() => {
    // Track page views when location changes
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default useGoogleAnalytics; 