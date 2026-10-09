/**
 * Centralized Advertising Configuration for Toolio
 * Supports CPM network & Adsterra formats: Banners, Native, Popunder, Social Bar, and Sticky Footer.
 */

import { DEFAULT_ADS_CONFIG, AdSystemConfig, loadAdsConfig, saveAdsConfig } from '../config/ads';

export type AdFormat =
  | 'banner_728x90'
  | 'banner_468x60'
  | 'banner_300x250'
  | 'banner_320x50'
  | 'banner_160x300'
  | 'banner_160x600'
  | 'native'
  | 'social_bar'
  | 'popunder'
  | 'interstitial'
  | 'sticky_footer';

export type AdPlacement =
  | 'header_top'
  | 'home_mid_content'
  | 'tool_page_top'
  | 'tool_page_below_workspace'
  | 'tool_page_in_content'
  | 'tool_page_sidebar'
  | 'tool_page_download_area'
  | 'category_page_banner'
  | 'category_page_in_grid'
  | 'all_tools_in_grid'
  | 'sticky_footer';

export type ConsentStatus = 'granted' | 'denied' | 'pending' | 'custom';

export interface AdsterraKeys {
  banner728x90: string;
  banner468x60: string;
  banner300x250: string;
  banner320x50: string;
  banner160x300: string;
  banner160x600: string;
  nativeZoneId: string;
  nativeContainerId: string;
  nativeScriptUrl: string;
  socialBarScriptUrl: string;
  popunderScriptUrl: string;
  popunderUrl: string;
  interstitialKey: string;
}

export interface AdConfig {
  /** Master switch to enable or disable all advertisements across Toolio */
  enabled: boolean;

  /** When true, renders simulated ad creative for development/testing */
  simulationMode: boolean;

  /** Ad network publisher script domain */
  adsterraDomain: string;

  /** Configurable zone keys and exact URLs */
  keys: AdsterraKeys;

  /** Toggle individual ad formats */
  formats: {
    banner728x90: boolean;
    banner468x60: boolean;
    banner300x250: boolean;
    banner320x50: boolean;
    banner160x300: boolean;
    banner160x600: boolean;
    native: boolean;
    socialBar: boolean;
    popunder: boolean;
    interstitial: boolean;
    stickyFooter: boolean;
  };

  /** Toggle specific placements across website views */
  placements: {
    headerTop: boolean;
    homeMidContent: boolean;
    toolPageTop: boolean;
    toolPageBelowWorkspace: boolean;
    toolPageInContent: boolean;
    toolPageSidebar: boolean;
    toolPageDownloadArea: boolean;
    categoryPageBanner: boolean;
    categoryPageInGrid: boolean;
    allToolsInGrid: boolean;
    stickyFooter: boolean;
  };

  /** Explicit named configuration switches requested */
  enablePopunder: boolean;
  enableSocialBar: boolean;
  enableNativeBanner: boolean;
  enableTopBanner: boolean;
  enableToolPageAds: boolean;
  enableDownloadAreaAds: boolean;
  enableFooterAds: boolean;
  enableDesktopSidebarAds: boolean;

  /** Smart Download Ad Flow Settings */
  enableDownloadAdFlow: boolean;
  downloadFallbackMode: 'immediate' | 'interstitial' | 'timeout';
  downloadAdTimeoutMs: number;
  requireProviderCompletionEvent: boolean;

  /** Frequency & pacing rules */
  frequency: {
    popunderIntervalMinutes: number;
    popunderMaxPerSession: number;
    interstitialActionInterval: number;
    interstitialCountdownSeconds: number;
    socialBarDelayMs: number;
  };

  /** Device targeting */
  deviceTargeting: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };

  /** Consent requirements */
  privacy: {
    requireConsent: boolean;
    respectDoNotTrack: boolean;
  };
}

export const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: true,
  // Live ad mode enabled by default (no fake ads or permanent demo banners)
  simulationMode: false,
  adsterraDomain: 'www.highrevenueformat.com',

  // Exact supplied publisher keys and URLs
  keys: {
    banner728x90: '8110ff74d694e9a2bf35e48000587723',
    banner468x60: '859d003a52887d813d9b4e192d33eb86',
    banner300x250: '6d92c2bcf70a22826abe02b387d99ec8',
    banner320x50: '461a234227ab8e1e22d685c892392a56',
    banner160x300: '7a1a719661547de84c6c5832100798fe',
    banner160x600: '5674dde53cf28ea767bc41b4c9b5cd74',
    nativeZoneId: '44478c322a08097e628f8661377529f3',
    nativeContainerId: 'container-44478c322a08097e628f8661377529f3',
    nativeScriptUrl: 'https://pl31740852.profitableratecpmnetwork.com/44478c322a08097e628f8661377529f3/invoke.js',
    socialBarScriptUrl: 'https://pl31740853.profitableratecpmnetwork.com/ae/1b/bf/ae1bbf4d7c8ba9ab9bbf627d0e110e5c.js',
    popunderScriptUrl: 'https://pl31740851.profitableratecpmnetwork.com/08/47/74/084774bb6039da316aa8167cdb17fc5b.js',
    popunderUrl: 'https://pl31740851.profitableratecpmnetwork.com/08/47/74/084774bb6039da316aa8167cdb17fc5b.js',
    interstitialKey: '8110ff74d694e9a2bf35e48000587723',
  },

  // Primary switches
  enablePopunder: true,
  enableSocialBar: true,
  enableNativeBanner: true,
  enableTopBanner: true,
  enableToolPageAds: true,
  enableDownloadAreaAds: true,
  enableFooterAds: true,
  enableDesktopSidebarAds: true,

  // Smart Download Flow Defaults
  enableDownloadAdFlow: true,
  downloadFallbackMode: 'immediate',
  downloadAdTimeoutMs: 1500,
  requireProviderCompletionEvent: false,

  formats: {
    banner728x90: true,
    banner468x60: true,
    banner300x250: true,
    banner320x50: true,
    banner160x300: true,
    banner160x600: true,
    native: true,
    socialBar: true,
    popunder: true,
    interstitial: false,
    stickyFooter: true,
  },

  placements: {
    headerTop: true,
    homeMidContent: true,
    toolPageTop: true,
    toolPageBelowWorkspace: true,
    toolPageInContent: true,
    toolPageSidebar: true,
    toolPageDownloadArea: true,
    categoryPageBanner: true,
    categoryPageInGrid: true,
    allToolsInGrid: true,
    stickyFooter: true,
  },

  frequency: {
    popunderIntervalMinutes: 30,
    popunderMaxPerSession: 2,
    interstitialActionInterval: 5,
    interstitialCountdownSeconds: 5,
    socialBarDelayMs: 3000,
  },

  deviceTargeting: {
    desktop: true,
    tablet: true,
    mobile: true,
  },

  privacy: {
    requireConsent: true,
    respectDoNotTrack: true,
  },
};

const STORAGE_KEY_CONFIG = 'toolio_ad_config_v2';
const STORAGE_KEY_CONSENT = 'toolio_ad_consent_v1';
const STORAGE_KEY_IMPRESSIONS = 'toolio_ad_impressions_v1';

export function loadStoredAdConfig(): AdConfig {
  if (typeof window === 'undefined') return DEFAULT_AD_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return DEFAULT_AD_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AD_CONFIG,
      ...parsed,
      // Strictly maintain publisher network keys and script URLs
      keys: DEFAULT_AD_CONFIG.keys,
      adsterraDomain: DEFAULT_AD_CONFIG.adsterraDomain,
      formats: { ...DEFAULT_AD_CONFIG.formats, ...(parsed.formats || {}) },
      placements: { ...DEFAULT_AD_CONFIG.placements, ...(parsed.placements || {}) },
      frequency: { ...DEFAULT_AD_CONFIG.frequency, ...(parsed.frequency || {}) },
      deviceTargeting: { ...DEFAULT_AD_CONFIG.deviceTargeting, ...(parsed.deviceTargeting || {}) },
      privacy: { ...DEFAULT_AD_CONFIG.privacy, ...(parsed.privacy || {}) },
    };
  } catch {
    return DEFAULT_AD_CONFIG;
  }
}

export function saveStoredAdConfig(config: Partial<AdConfig>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadStoredAdConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save ad config', e);
  }
}

export function loadStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'granted';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONSENT);
    if (raw === 'granted' || raw === 'denied' || raw === 'custom') {
      return raw;
    }
    return 'pending';
  } catch {
    return 'granted';
  }
}

export function saveStoredConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CONSENT, status);
  } catch (e) {
    console.error('Failed to save ad consent', e);
  }
}

export function getSessionImpressions(): Record<string, number> {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_IMPRESSIONS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordSessionImpression(adId: string): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const stats = getSessionImpressions();
    stats[adId] = (stats[adId] || 0) + 1;
    sessionStorage.setItem(STORAGE_KEY_IMPRESSIONS, JSON.stringify(stats));
  } catch {}
}
