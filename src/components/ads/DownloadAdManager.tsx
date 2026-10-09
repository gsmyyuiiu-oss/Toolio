import React, { useState, useEffect } from 'react';
import {
  executeSmartDownload,
  downloadBlob,
  downloadDataUrl,
  downloadText,
  downloadUrl,
  subscribeToDownloadStatus,
  SmartDownloadOptions,
} from '../../lib/downloadManager';

export {
  executeSmartDownload,
  downloadBlob,
  downloadDataUrl,
  downloadText,
  downloadUrl,
  subscribeToDownloadStatus,
};
export type { SmartDownloadOptions };

/**
 * React Hook for tools to access smart download capabilities
 */
export function useSmartDownload() {
  const [downloadState, setDownloadState] = useState<{
    isDownloading: boolean;
    filename: string | null;
    message: string | null;
  }>({
    isDownloading: false,
    filename: null,
    message: null,
  });

  useEffect(() => {
    const unsubscribe = subscribeToDownloadStatus((status) => {
      setDownloadState(status);
    });
    return unsubscribe;
  }, []);

  return {
    ...downloadState,
    download: executeSmartDownload,
    downloadBlob,
    downloadDataUrl,
    downloadText,
    downloadUrl,
  };
}

/**
 * Download Indicator Component
 * Optionally displays a small non-intrusive progress notification when a large download is being prepared.
 */
export const DownloadAdManager: React.FC = () => {
  const { isDownloading, message } = useSmartDownload();

  if (!isDownloading || !message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-800/95 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2.5 text-xs font-medium animate-fade-in pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
      <span>{message}</span>
    </div>
  );
};
