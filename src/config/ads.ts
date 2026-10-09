/**
 * Centralized Advertising Configuration for Toolio
 * Single source of truth for all monetization settings, provider URLs, and placement switches.
 */

export interface BannerConfig {
  key: string;
  width: number;
  height: number;
  scriptUrl: string;
}

export interface AdSystemConfig {
  /** Master switch to enable or disable all advertising across Toolio */
  enabled: boolean;

  /** Primary placement & format switches requested */
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

  /** Exact provider scripts and banner zone configurations */
  providers: {
    popunder: {
      scriptUrl: string;
      id: string;
    };
    socialBar: {
      scriptUrl: string;
      id: string;
    };
    native: {
      scriptUrl: string;
      containerId: string;
    };
    banners: {
      '728x90': BannerConfig;
      '468x60': BannerConfig;
      '300x250': BannerConfig;
      '320x50': BannerConfig;
      '160x300': BannerConfig;
      '160x600': BannerConfig;
    };
  };

  /** Privacy and compliance rules */
  privacy: {
    requireConsent: boolean;
    respectDoNotTrack: boolean;
  };
}

/**
 * Default Advertising Configuration
 * Change any switch here to toggle formats or placements site-wide.
 */
export const DEFAULT_ADS_CONFIG: AdSystemConfig = {
  enabled: true,

  // Format and Placement Switches
  enablePopunder: true,
  enableSocialBar: true,
  enableNativeBanner: true,
  enableTopBanner: true,
  enableToolPageAds: true,
  enableDownloadAreaAds: true,
  enableFooterAds: true,
  enableDesktopSidebarAds: true,

  // Smart Download Ad Flow Defaults
  enableDownloadAdFlow: true,
  downloadFallbackMode: 'immediate',
  downloadAdTimeoutMs: 1500,
  requireProviderCompletionEvent: false,

  // Exact supplied ad network scripts and credentials
  providers: {
    popunder: {
      scriptUrl: 'https://pl31740851.profitableratecpmnetwork.com/08/47/74/084774bb6039da316aa8167cdb17fc5b.js',
      id: 'toolio-popunder-script',
    },
    socialBar: {
      scriptUrl: 'https://pl31740853.profitableratecpmnetwork.com/ae/1b/bf/ae1bbf4d7c8ba9ab9bbf627d0e110e5c.js',
      id: 'toolio-socialbar-script',
    },
    native: {
      scriptUrl: 'https://pl31740852.profitableratecpmnetwork.com/44478c322a08097e628f8661377529f3/invoke.js',
      containerId: 'container-44478c322a08097e628f8661377529f3',
    },
    banners: {
      '728x90': {
        key: '8110ff74d694e9a2bf35e48000587723',
        width: 728,
        height: 90,
        scriptUrl: 'https://www.highrevenueformat.com/8110ff74d694e9a2bf35e48000587723/invoke.js',
      },
      '468x60': {
        key: '859d003a52887d813d9b4e192d33eb86',
        width: 468,
        height: 60,
        scriptUrl: 'https://www.highrevenueformat.com/859d003a52887d813d9b4e192d33eb86/invoke.js',
      },
      '300x250': {
        key: '6d92c2bcf70a22826abe02b387d99ec8',
        width: 300,
        height: 250,
        scriptUrl: 'https://www.highrevenueformat.com/6d92c2bcf70a22826abe02b387d99ec8/invoke.js',
      },
      '320x50': {
        key: '461a234227ab8e1e22d685c892392a56',
        width: 320,
        height: 50,
        scriptUrl: 'https://www.highrevenueformat.com/461a234227ab8e1e22d685c892392a56/invoke.js',
      },
      '160x300': {
        key: '7a1a719661547de84c6c5832100798fe',
        width: 160,
        height: 300,
        scriptUrl: 'https://www.highrevenueformat.com/7a1a719661547de84c6c5832100798fe/invoke.js',
      },
      '160x600': {
        key: '5674dde53cf28ea767bc41b4c9b5cd74',
        width: 160,
        height: 600,
        scriptUrl: 'https://www.highrevenueformat.com/5674dde53cf28ea767bc41b4c9b5cd74/invoke.js',
      },
    },
  },

  privacy: {
    requireConsent: true,
    respectDoNotTrack: true,
  },
};

const STORAGE_KEY = 'toolio_ads_config';

export function loadAdsConfig(): AdSystemConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_ADS_CONFIG,
        ...parsed,
        providers: {
          ...DEFAULT_ADS_CONFIG.providers,
          ...(parsed.providers || {}),
          banners: {
            ...DEFAULT_ADS_CONFIG.providers.banners,
            ...((parsed.providers && parsed.providers.banners) || {}),
          },
        },
      };
    }
  } catch {}
  return DEFAULT_ADS_CONFIG;
}

export function saveAdsConfig(config: Partial<AdSystemConfig>): void {
  try {
    const current = loadAdsConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
