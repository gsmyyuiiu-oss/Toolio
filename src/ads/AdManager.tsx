import React, { useEffect } from 'react';
import { useAds } from './AdProvider';

const POPUNDER_SCRIPT_ID = 'toolio-ad-popunder-script';
const SOCIALBAR_SCRIPT_ID = 'toolio-ad-socialbar-script';

export const AdManager: React.FC = () => {
  const { config, consent } = useAds();

  // 1. Popunder global script injection (loads only once, never duplicates across routes)
  useEffect(() => {
    const isPopunderEnabled =
      config.enabled &&
      config.enablePopunder &&
      config.formats.popunder &&
      consent !== 'denied';

    if (!isPopunderEnabled) {
      // Remove script if disabled
      const existing = document.getElementById(POPUNDER_SCRIPT_ID);
      if (existing) {
        existing.remove();
      }
      return;
    }

    // Check if already injected
    if (document.getElementById(POPUNDER_SCRIPT_ID)) {
      return;
    }

    try {
      const script = document.createElement('script');
      script.id = POPUNDER_SCRIPT_ID;
      script.src = config.keys.popunderScriptUrl;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.head.appendChild(script);
    } catch (err) {
      console.warn('[AdManager] Popunder script setup error:', err);
    }
  }, [config.enabled, config.enablePopunder, config.formats.popunder, config.keys.popunderScriptUrl, consent]);

  // 2. Social Bar global script injection (loads only once site-wide, never duplicates)
  useEffect(() => {
    const isSocialBarEnabled =
      config.enabled &&
      config.enableSocialBar &&
      config.formats.socialBar &&
      consent !== 'denied';

    if (!isSocialBarEnabled) {
      const existing = document.getElementById(SOCIALBAR_SCRIPT_ID);
      if (existing) {
        existing.remove();
      }
      return;
    }

    if (document.getElementById(SOCIALBAR_SCRIPT_ID)) {
      return;
    }

    try {
      const script = document.createElement('script');
      script.id = SOCIALBAR_SCRIPT_ID;
      script.src = config.keys.socialBarScriptUrl;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
    } catch (err) {
      console.warn('[AdManager] Social Bar script setup error:', err);
    }
  }, [config.enabled, config.enableSocialBar, config.formats.socialBar, config.keys.socialBarScriptUrl, consent]);

  // 3. User protection: protect tool action & download buttons from being hijacked
  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Identify genuine download buttons, file uploads, and conversion actions
      const isProtectedAction =
        target.closest('input[type="file"]') ||
        target.closest('button[data-action="download"]') ||
        target.closest('a[download]') ||
        target.closest('.download-btn') ||
        target.closest('.no-popunder');

      if (isProtectedAction) {
        // Tag with no-popunder class to prevent popunder network listeners from attaching
        target.classList.add('no-popunder');
      }
    };

    document.addEventListener('click', handleCaptureClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleCaptureClick, { capture: true });
    };
  }, []);

  return null;
};
