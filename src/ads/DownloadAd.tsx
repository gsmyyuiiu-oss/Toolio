import React from 'react';
import { useAds } from './AdProvider';
import { BannerAd } from './BannerAd';

interface DownloadAdProps {
  className?: string;
}

export const DownloadAd: React.FC<DownloadAdProps> = ({ className = '' }) => {
  const { config, consent, isAdBlockActive } = useAds();

  if (
    !config.enabled ||
    !config.enableDownloadAreaAds ||
    consent === 'denied' ||
    isAdBlockActive
  ) {
    return null;
  }

  return (
    <aside
      className={`my-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 no-popunder ${className}`}
      aria-label="Sponsored recommendation near results"
    >
      <div className="flex flex-col items-center justify-center">
        <BannerAd
          size="320x50"
          placementId="tool_download_area"
          label="Sponsored"
          className="my-1"
        />
      </div>
    </aside>
  );
};
