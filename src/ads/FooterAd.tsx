import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { BannerAd } from './BannerAd';
import { useAds } from './AdProvider';

export const FooterAd: React.FC = () => {
  const { config, consent, isAdBlockActive } = useAds();
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (
    !config.enabled ||
    !config.enableFooterAds ||
    !config.formats.stickyFooter ||
    !config.placements.stickyFooter ||
    consent === 'denied' ||
    isAdBlockActive ||
    dismissed
  ) {
    return null;
  }

  if (minimized) {
    return (
      <div className="fixed bottom-3 right-4 z-40">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/90 text-white text-[11px] font-semibold shadow-lg backdrop-blur-md border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
          title="Restore sponsored footer ad"
        >
          <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>Show Sponsor</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 py-1 px-2.5 flex flex-col items-center"
      aria-label="Floating Sticky Advertisement"
    >
      {/* Top action bar */}
      <div className="w-full max-w-4xl flex items-center justify-between px-2 text-[10px] text-slate-500 mb-0.5">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Sponsored Banner • Supporting Free Online Tools</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="hover:text-slate-800 dark:hover:text-slate-200 p-0.5 transition-colors cursor-pointer flex items-center gap-0.5"
            title="Minimize"
          >
            <ChevronDown className="w-3 h-3" />
            <span className="text-[9px]">Minimize</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="hover:text-red-500 p-0.5 transition-colors cursor-pointer flex items-center gap-0.5"
            title="Close this advertisement"
          >
            <X className="w-3 h-3" />
            <span className="text-[9px]">Close</span>
          </button>
        </div>
      </div>

      {/* Banner ad container */}
      <div className="hidden sm:block">
        <BannerAd size="728x90" placementId="sticky_footer_desktop" label="Sponsored Banner" className="my-0" />
      </div>
      <div className="block sm:hidden max-w-full overflow-hidden flex justify-center">
        <BannerAd size="320x50" placementId="sticky_footer_mobile" label="Sponsored Banner" className="my-0 max-w-full" />
      </div>
    </aside>
  );
};
