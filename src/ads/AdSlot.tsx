import React from 'react';
import { AdPlacement } from './adConfig';
import { BannerAd } from './BannerAd';
import { NativeAd } from './NativeAd';
import { DownloadAd } from './DownloadAd';
import { useAds } from './AdProvider';
import { AdErrorBoundary } from './AdErrorBoundary';

interface AdSlotProps {
  placement: AdPlacement | 'native_banner' | 'home_native';
  className?: string;
  label?: string;
}

const AdSlotInternal: React.FC<AdSlotProps> = ({
  placement,
  className = '',
  label,
}) => {
  const { config, consent } = useAds();

  if (!config.enabled || consent === 'denied') {
    return null;
  }

  switch (placement) {
    case 'header_top':
      if (!config.enableTopBanner || !config.placements.headerTop) return null;
      return (
        <div className={`w-full max-w-5xl mx-auto px-2 sm:px-4 ${className}`} aria-label="Sponsored header banner">
          <div className="hidden md:block">
            <BannerAd size="728x90" placementId="header_top_desktop" label={label || 'Sponsored'} />
          </div>
          <div className="hidden sm:block md:hidden">
            <BannerAd size="468x60" placementId="header_top_tablet" label={label || 'Sponsored'} />
          </div>
          <div className="block sm:hidden">
            <BannerAd size="320x50" placementId="header_top_mobile" label={label || 'Sponsored'} />
          </div>
        </div>
      );

    case 'home_mid_content':
      if (!config.placements.homeMidContent) return null;
      return (
        <section className={`w-full max-w-5xl mx-auto px-4 my-8 ${className}`} aria-label="Sponsored recommendation">
          <div className="hidden md:block">
            <BannerAd size="728x90" placementId="home_mid_desktop" label={label || 'Sponsored Recommendation'} />
          </div>
          <div className="hidden sm:block md:hidden">
            <BannerAd size="468x60" placementId="home_mid_tablet" label={label || 'Sponsored Recommendation'} />
          </div>
          <div className="block sm:hidden">
            <BannerAd size="300x250" placementId="home_mid_mobile" label={label || 'Sponsored Recommendation'} />
          </div>
        </section>
      );

    case 'native_banner':
    case 'home_native':
      if (!config.enableNativeBanner) return null;
      return (
        <section className={`w-full max-w-5xl mx-auto px-4 my-6 ${className}`} aria-label="Sponsored native partner">
          <NativeAd placementId="home_native_banner" />
        </section>
      );

    case 'tool_page_top':
      if (!config.enableTopBanner || !config.enableToolPageAds) return null;
      return (
        <div className={`my-4 max-w-4xl mx-auto ${className}`} aria-label="Sponsored tool banner">
          <BannerAd size="responsive" placementId="tool_top_banner" label={label || 'Sponsored'} />
        </div>
      );

    case 'tool_page_below_workspace':
      if (!config.enableToolPageAds || !config.placements.toolPageBelowWorkspace) return null;
      return (
        <div className={`my-6 max-w-4xl mx-auto ${className}`} aria-label="Sponsored tool ad">
          <div className="hidden md:block">
            <BannerAd size="728x90" placementId="tool_below_desktop" label={label || 'Sponsored'} />
          </div>
          <div className="hidden sm:block md:hidden">
            <BannerAd size="468x60" placementId="tool_below_tablet" label={label || 'Sponsored'} />
          </div>
          <div className="block sm:hidden">
            <BannerAd size="300x250" placementId="tool_below_mobile" label={label || 'Sponsored'} />
          </div>
        </div>
      );

    case 'tool_page_download_area':
      if (!config.enableDownloadAreaAds) return null;
      return <DownloadAd className={className} />;

    case 'tool_page_in_content':
      if (!config.enableToolPageAds || !config.placements.toolPageInContent) return null;
      return (
        <div className={`my-6 max-w-xl mx-auto ${className}`} aria-label="Sponsored content ad">
          <BannerAd size="300x250" placementId="tool_in_content" label={label || 'Featured Partner'} />
        </div>
      );

    case 'tool_page_sidebar':
      if (!config.enableDesktopSidebarAds || !config.placements.toolPageSidebar) return null;
      // Only render on large screens where a proper sidebar can fit without clutter
      return (
        <div className={`hidden lg:block my-4 sticky top-24 ${className}`} aria-label="Sponsored sidebar ad">
          <BannerAd size="160x600" placementId="tool_sidebar_desktop" label={label || 'Sponsored'} />
        </div>
      );

    case 'category_page_banner':
      if (!config.placements.categoryPageBanner) return null;
      return (
        <div className={`my-6 max-w-5xl mx-auto px-4 ${className}`} aria-label="Sponsored category banner">
          <BannerAd size="responsive" placementId="category_banner" label={label || 'Sponsored'} />
        </div>
      );

    case 'category_page_in_grid':
      if (!config.enableNativeBanner || !config.placements.categoryPageInGrid) return null;
      return <NativeAd placementId="category_grid_native" className={className} />;

    case 'all_tools_in_grid':
      if (!config.enableNativeBanner || !config.placements.allToolsInGrid) return null;
      return <NativeAd placementId="all_tools_grid_native" className={className} />;

    default:
      return null;
  }
};

export const AdSlot: React.FC<AdSlotProps> = (props) => {
  return (
    <AdErrorBoundary>
      <AdSlotInternal {...props} />
    </AdErrorBoundary>
  );
};
