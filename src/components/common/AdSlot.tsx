import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ADSENSE_CLIENT_ID } from '../../config/site';

interface AdSlotProps {
  placement?: 'tool-bottom' | 'content-inline' | 'sidebar';
  slotId?: string;
  className?: string;
}

/**
 * Empty ad placeholder container with reserved fixed height to prevent Cumulative Layout Shift (CLS).
 * Renders real AdSense unit ONLY when ADSENSE_CLIENT_ID is configured AND consent was granted.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  placement = 'tool-bottom',
  slotId,
  className = '',
}) => {
  const { language } = useApp();
  const [canShowAds, setCanShowAds] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('adawaty_cookie_consent');
      setCanShowAds(Boolean(ADSENSE_CLIENT_ID && ADSENSE_CLIENT_ID.trim() !== '' && consent === 'accepted'));
    };

    checkConsent();
    window.addEventListener('cookie_consent_updated', checkConsent);
    return () => window.removeEventListener('cookie_consent_updated', checkConsent);
  }, []);

  useEffect(() => {
    if (canShowAds && slotId) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Ignore AdSense push error if already loaded
      }
    }
  }, [canShowAds, slotId]);

  const heights = {
    'tool-bottom': 'h-24 sm:h-28 max-w-3xl',
    'content-inline': 'h-44 sm:h-48 max-w-2xl',
    sidebar: 'h-64 sm:h-80 w-full',
  };

  const label = language === 'ar' ? 'مساحة إعلانية' : 'Advertisement';

  if (canShowAds && slotId) {
    return (
      <div className={`my-6 mx-auto w-full ${heights[placement]} overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`my-6 mx-auto w-full ${heights[placement]} border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 flex flex-col items-center justify-center p-3 text-center transition-colors select-none ${className}`}
      aria-label={label}
    >
      <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400 dark:text-slate-500 mb-1">
        {label}
      </span>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
        {language === 'ar'
          ? 'إعلانات غير مزعجة تساعدنا على توفير أدوات مجانية دائماً'
          : 'Non-intrusive ads that help keep our tools free forever'}
      </p>
    </div>
  );
};
