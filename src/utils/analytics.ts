import { GA_MEASUREMENT_ID, ADSENSE_CLIENT_ID } from '../config/site';

/**
 * Initializes Google Analytics and Google AdSense strictly when:
 * 1. The ID is configured (non-empty)
 * 2. User has consented in the Cookie/Consent banner ('accepted')
 */
export function initThirdPartyServices() {
  if (typeof window === 'undefined') return;

  const consent = localStorage.getItem('adawaty_cookie_consent');
  const hasConsent = consent === 'accepted';

  // 1. Google Analytics
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.trim() !== '' && hasConsent) {
    if (!document.getElementById('ga-gtag-script')) {
      const script = document.createElement('script');
      script.id = 'ga-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = 'ga-init-script';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
      `;
      document.head.appendChild(inlineScript);
    }
  }

  // 2. Google AdSense
  if (ADSENSE_CLIENT_ID && ADSENSE_CLIENT_ID.trim() !== '' && hasConsent) {
    if (!document.getElementById('adsense-script')) {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      document.head.appendChild(script);
    }
  }
}
