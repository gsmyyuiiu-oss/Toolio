import React from 'react';
import { AdSlot } from '../../ads/AdSlot';
import { BannerAd } from '../../ads/BannerAd';
import { AdPlacement } from '../../ads/adConfig';

interface AdBannerProps {
  position?: 'top' | 'below-tool' | 'sidebar' | 'in-feed';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'below-tool', className = '' }) => {
  if (position === 'below-tool') {
    return <AdSlot placement="tool_page_below_workspace" className={className} />;
  }

  if (position === 'top') {
    return <AdSlot placement="header_top" className={className} />;
  }

  if (position === 'sidebar') {
    return <AdSlot placement="tool_page_sidebar" className={className} />;
  }

  return (
    <div className={`my-6 flex justify-center ${className}`}>
      <div className="hidden sm:block">
        <BannerAd size="728x90" placementId="in_feed_banner" label="Sponsored Banner" />
      </div>
      <div className="block sm:hidden">
        <BannerAd size="300x250" placementId="in_feed_banner_mobile" label="Sponsored Banner" />
      </div>
    </div>
  );
};

