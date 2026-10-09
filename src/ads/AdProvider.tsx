import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  AdConfig,
  ConsentStatus,
  DEFAULT_AD_CONFIG,
  loadStoredAdConfig,
  saveStoredAdConfig,
  loadStoredConsent,
  saveStoredConsent,
  getSessionImpressions,
  recordSessionImpression,
} from './adConfig';
import { FooterAd } from './FooterAd';
import { AdManager } from './AdManager';
import { DownloadAdManager } from '../components/ads/DownloadAdManager';
import { InterstitialModal, InterstitialState } from './InterstitialManager';
import { AdConsent } from './AdConsent';
import { AdSettingsModal } from './AdSettingsModal';

interface AdContextValue {
  config: AdConfig;
  updateConfig: (newConfig: Partial<AdConfig>) => void;
  resetConfig: () => void;
  consent: ConsentStatus;
  updateConsent: (status: ConsentStatus) => void;
  isAdBlockActive: boolean;
  impressions: Record<string, number>;
  recordImpression: (adId: string) => void;
  triggerInterstitial: (onComplete: () => void, reason?: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const AdContext = createContext<AdContextValue | undefined>(undefined);

export const AdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AdConfig>(() => loadStoredAdConfig());
  const [consent, setConsent] = useState<ConsentStatus>(() => loadStoredConsent());
  const [isAdBlockActive, setIsAdBlockActive] = useState<boolean>(false);
  const [impressions, setImpressions] = useState<Record<string, number>>(() => getSessionImpressions());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [actionCounter, setActionCounter] = useState<number>(0);

  const [interstitialState, setInterstitialState] = useState<InterstitialState>({
    isOpen: false,
    reason: undefined,
  });

  // Detect ad blocker non-destructively
  useEffect(() => {
    let bait: HTMLElement | null = null;
    try {
      bait = document.createElement('div');
      bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links banner-ad ad-slot adsbox';
      bait.style.position = 'absolute';
      bait.style.left = '-9999px';
      bait.style.top = '-9999px';
      bait.style.width = '1px';
      bait.style.height = '1px';
      bait.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bait);

      const isBlocked =
        window.getComputedStyle(bait).display === 'none' ||
        window.getComputedStyle(bait).visibility === 'hidden' ||
        bait.offsetHeight === 0;

      setIsAdBlockActive(isBlocked);
    } catch {
      setIsAdBlockActive(false);
    }

    return () => {
      if (bait && bait.parentNode) {
        try {
          bait.parentNode.removeChild(bait);
        } catch {}
      }
    };
  }, []);

  // Update & persist config
  const updateConfig = useCallback((newPartial: Partial<AdConfig>) => {
    setConfig((prev) => {
      const merged: AdConfig = {
        ...prev,
        ...newPartial,
        keys: DEFAULT_AD_CONFIG.keys,
        adsterraDomain: DEFAULT_AD_CONFIG.adsterraDomain,
        formats: { ...prev.formats, ...(newPartial.formats || {}) },
        placements: { ...prev.placements, ...(newPartial.placements || {}) },
        frequency: { ...prev.frequency, ...(newPartial.frequency || {}) },
        deviceTargeting: { ...prev.deviceTargeting, ...(newPartial.deviceTargeting || {}) },
        privacy: { ...prev.privacy, ...(newPartial.privacy || {}) },
      };
      saveStoredAdConfig(merged);
      return merged;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_AD_CONFIG);
    saveStoredAdConfig(DEFAULT_AD_CONFIG);
  }, []);

  // Update & persist consent
  const updateConsent = useCallback((status: ConsentStatus) => {
    setConsent(status);
    saveStoredConsent(status);
  }, []);

  // Impression counter
  const recordImpression = useCallback((adId: string) => {
    recordSessionImpression(adId);
    setImpressions(getSessionImpressions());
  }, []);

  // Programmatic Interstitial trigger (for tools)
  const triggerInterstitial = useCallback(
    (onComplete: () => void, reason?: string) => {
      const nextCount = actionCounter + 1;
      setActionCounter(nextCount);

      const interval = config.frequency.interstitialActionInterval || 5;
      const shouldTrigger =
        config.enabled &&
        config.formats.interstitial &&
        consent !== 'denied' &&
        nextCount % interval === 0;

      if (shouldTrigger) {
        setInterstitialState({
          isOpen: true,
          onComplete,
          reason: reason || 'Task Completed',
        });
      } else {
        onComplete();
      }
    },
    [actionCounter, config, consent]
  );

  const handleCloseInterstitial = useCallback(() => {
    setInterstitialState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AdContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        consent,
        updateConsent,
        isAdBlockActive,
        impressions,
        recordImpression,
        triggerInterstitial,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}

      {/* Global Ad Manager (Popunder & Social Bar duplicate-safe scripts) */}
      <AdManager />

      {/* Smart Download Flow Global Notifications */}
      <DownloadAdManager />

      {/* Sticky footer banner */}
      <FooterAd />

      {/* Interstitial dialog */}
      <InterstitialModal
        isOpen={interstitialState.isOpen}
        onClose={handleCloseInterstitial}
        onComplete={interstitialState.onComplete}
        reason={interstitialState.reason}
      />

      {/* Privacy and consent controls */}
      <AdConsent />
      <AdSettingsModal />
    </AdContext.Provider>
  );
};

export const useAds = (): AdContextValue => {
  const ctx = useContext(AdContext);
  if (!ctx) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return ctx;
};
