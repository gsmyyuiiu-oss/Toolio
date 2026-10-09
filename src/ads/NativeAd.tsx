import React, { useEffect, useId } from 'react';
import { useAds } from './AdProvider';

interface NativeAdProps {
  placementId?: string;
  className?: string;
}

export const NativeAd: React.FC<NativeAdProps> = ({
  placementId = 'native_grid_slot',
  className = '',
}) => {
  const { config, isAdBlockActive, recordImpression, consent } = useAds();
  const reactId = useId();

  const isEnabled =
    config.enabled &&
    config.enableNativeBanner &&
    config.formats.native &&
    consent !== 'denied' &&
    !isAdBlockActive;

  useEffect(() => {
    if (isEnabled) {
      recordImpression(placementId);
    }
  }, [isEnabled, placementId, recordImpression]);

  if (!isEnabled) {
    return null;
  }

  const containerId = config.keys.nativeContainerId || 'container-44478c322a08097e628f8661377529f3';
  const scriptUrl = config.keys.nativeScriptUrl || 'https://pl31740852.profitableratecpmnetwork.com/44478c322a08097e628f8661377529f3/invoke.js';

  // Provider required container and script inside isolated document
  const nativeIframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      min-height: 100%;
      background: transparent;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #${containerId} {
      width: 100%;
      min-height: 160px;
    }
  </style>
</head>
<body>
  <div id="${containerId}"></div>
  <script async="async" data-cfasync="false" src="${scriptUrl}"></script>
</body>
</html>`;

  return (
    <div
      id={`native-slot-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`}
      className={`my-6 w-full max-w-full min-w-0 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-3 sm:p-4 overflow-hidden ${className}`}
      data-ad-placement={placementId}
    >
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 px-1">
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Sponsored Recommendation
        </span>
        <span className="text-[10px] text-slate-500">
          Partner Network
        </span>
      </div>

      <div className="w-full min-h-[160px] overflow-hidden rounded-xl">
        <iframe
          srcDoc={nativeIframeHtml}
          width="100%"
          height="180"
          title="Sponsored Content"
          scrolling="no"
          frameBorder="0"
          className="w-full border-0 overflow-hidden"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
    </div>
  );
};
