import React from 'react';
import { BannerAd } from './BannerAd';
import { useAds } from './AdProvider';

interface InContentAdProps {
  placementId?: string;
  className?: string;
}

export const InContentAd: React.FC<InContentAdProps> = ({
  placementId = 'in_content_slot',
  className = '',
}) => {
  const { config } = useAds();

  if (!config.enabled || !config.placements.toolPageInContent) {
    return null;
  }

  return (
    <div className={`my-8 py-2 border-y border-dashed border-slate-200 dark:border-slate-800 ${className}`}>
      {/* Desktop view 728x90 */}
      <div className="hidden md:block">
        <BannerAd size="728x90" placementId={placementId} label="Sponsored Recommendation" />
      </div>
      {/* Mobile view 300x250 */}
      <div className="block md:hidden">
        <BannerAd size="300x250" placementId={placementId} label="Sponsored Recommendation" />
      </div>
    </div>
  );
};
