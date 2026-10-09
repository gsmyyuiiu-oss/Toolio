import React, { useState, useEffect, useId } from 'react';
import { useAds } from './AdProvider';

export type BannerSize = '728x90' | '468x60' | '300x250' | '320x50' | '160x300' | '160x600' | 'responsive';

interface BannerAdProps {
  size?: BannerSize;
  placementId?: string;
  className?: string;
  label?: string;
}

interface BannerDetails {
  key: string;
  width: number;
  height: number;
  scriptUrl: string;
}

const BANNER_MAP: Record<Exclude<BannerSize, 'responsive'>, BannerDetails> = {
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
};

export const BannerAd: React.FC<BannerAdProps> = ({
  size = '728x90',
  placementId = 'banner_slot',
  className = '',
  label = 'Sponsored Advertisement',
}) => {
  const { config, consent, isAdBlockActive, recordImpression } = useAds();
  const reactId = useId();
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Monitor viewport width for clean responsive adaptation
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check consent and global switch
  if (!config.enabled || consent === 'denied' || isAdBlockActive) {
    return null;
  }

  // Determine effective dimensions
  let effectiveSize: Exclude<BannerSize, 'responsive'>;
  if (size === 'responsive') {
    if (viewportWidth >= 768) {
      effectiveSize = '728x90';
    } else if (viewportWidth >= 500) {
      effectiveSize = '468x60';
    } else {
      effectiveSize = '320x50';
    }
  } else {
    // If a fixed banner is too wide for screen, adapt down gracefully
    if (size === '728x90' && viewportWidth < 768) {
      effectiveSize = viewportWidth >= 500 ? '468x60' : '320x50';
    } else if (size === '468x60' && viewportWidth < 500) {
      effectiveSize = '320x50';
    } else {
      effectiveSize = size;
    }
  }

  const banner = BANNER_MAP[effectiveSize];
  if (!banner) return null;

  // Record impression
  useEffect(() => {
    recordImpression(`${placementId}_${effectiveSize}`);
  }, [placementId, effectiveSize, recordImpression]);

  // Construct isolated iframe document to prevent atOptions global collisions
  const iframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${banner.key}',
      'format' : 'iframe',
      'height' : ${banner.height},
      'width' : ${banner.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="${banner.scriptUrl}"></script>
</body>
</html>`;

  return (
    <div
      id={`banner-slot-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`}
      className={`my-4 mx-auto w-full max-w-full min-w-0 flex flex-col items-center justify-center transition-all overflow-hidden ${className}`}
      data-ad-placement={placementId}
      data-ad-size={effectiveSize}
    >
      {/* Compliance header: clearly labeled "Sponsored" */}
      <div
        className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 px-1 w-full"
        style={{ maxWidth: `${banner.width}px` }}
      >
        <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          {banner.width}×{banner.height}
        </span>
      </div>

      {/* Ad iframe container with fixed exact dimensions */}
      <div
        className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center w-full"
        style={{
          maxWidth: `${banner.width}px`,
          height: `${banner.height}px`,
          minHeight: `${banner.height}px`,
        }}
      >
        <iframe
          srcDoc={iframeHtml}
          width={banner.width}
          height={banner.height}
          title={`Ad ${banner.width}x${banner.height}`}
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden max-w-full"
          style={{
            width: `${banner.width}px`,
            height: `${banner.height}px`,
            maxWidth: '100%',
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
    </div>
  );
};
