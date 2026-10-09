/**
 * Toolio Smart Download Manager
 * Centralized, safe, and policy-compliant file download execution for all 200+ tools.
 * 
 * - Preserves generated file output, MIME type, and exact filename.
 * - Prevents rapid duplicate downloads.
 * - Protects against popunder ad hijacking on download buttons (.no-popunder).
 * - Safe timeout and failure fallback so users never lose their generated file.
 * - Releases temporary Object URLs cleanly.
 */

import { loadAdsConfig } from '../config/ads';
import { trackEvent } from '../utils/analytics';

export interface SmartDownloadOptions {
  /** The data to download: can be a Blob, File, data URL string, blob URL, or raw text content */
  data: Blob | File | string;
  /** Intended output filename, e.g. "compressed-image.png", "document.pdf", "project.zip" */
  filename: string;
  /** Optional MIME type if passing raw text content */
  mimeType?: string;
  /** Optional tool slug or identifier for analytics tracking */
  toolSlug?: string;
  /** Optional progress callback */
  onStatusChange?: (status: 'idle' | 'preparing' | 'downloading' | 'completed' | 'error', message?: string) => void;
}

export type DownloadStatusListener = (status: {
  isDownloading: boolean;
  filename: string | null;
  message: string | null;
}) => void;

// Active downloads in-flight to prevent rapid double-clicks
const activeDownloads = new Set<string>();
const listeners = new Set<DownloadStatusListener>();

function notifyListeners(isDownloading: boolean, filename: string | null = null, message: string | null = null) {
  listeners.forEach((listener) => {
    try {
      listener({ isDownloading, filename, message });
    } catch {}
  });
}

export function subscribeToDownloadStatus(listener: DownloadStatusListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Sanitizes filename to prevent browser issues while preserving extension
 */
function sanitizeFilename(name: string): string {
  if (!name || typeof name !== 'string') return 'download.bin';
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim() || 'download.bin';
}

/**
 * Executes a smart download request.
 * Follows provider-compliance rules: since display banner/popunder/native formats
 * do not expose reliable programmatic reward completion callbacks, downloads start immediately
 * without blocking or freezing the user's file.
 */
export async function executeSmartDownload(options: SmartDownloadOptions): Promise<boolean> {
  const { data, filename, mimeType, toolSlug, onStatusChange } = options;

  // 1. Validate inputs
  if (!data) {
    console.error('[DownloadManager] Error: No download data provided.');
    onStatusChange?.('error', 'No file data generated.');
    return false;
  }

  const cleanFilename = sanitizeFilename(filename);

  // 2. Prevent duplicate downloads from rapid repeated clicks
  if (activeDownloads.has(cleanFilename)) {
    console.warn(`[DownloadManager] Download already in progress for "${cleanFilename}". Ignoring rapid click.`);
    return false;
  }

  activeDownloads.add(cleanFilename);
  notifyListeners(true, cleanFilename, 'Preparing download...');
  onStatusChange?.('preparing', 'Preparing download...');

  try {
    const config = loadAdsConfig();

    // 3. Ad Flow Evaluation
    // Important limitation check:
    // The configured Adsterra / CPM network display banners, popunder, and native units
    // do NOT expose an authorized programmatic rewarded video playback completion API.
    // Therefore, according to user guidelines, we do not fabricate fake completion events or delay downloads indefinitely.
    // If requireProviderCompletionEvent is configured but no provider event exists, we use the fallback mode.
    if (config.enableDownloadAdFlow && config.downloadFallbackMode === 'timeout') {
      // Configurable safe timeout (never exceeds timeoutMs)
      const timeoutMs = Math.min(config.downloadAdTimeoutMs || 1500, 2000);
      onStatusChange?.('downloading', 'Starting download...');
      await new Promise((resolve) => setTimeout(resolve, timeoutMs));
    }

    // 4. Resolve download URL and object URL tracking
    let targetUrl: string;
    let isTemporaryBlobUrl = false;

    if (typeof data === 'string') {
      if (data.startsWith('blob:')) {
        targetUrl = data;
        isTemporaryBlobUrl = false;
      } else if (data.startsWith('data:') || data.startsWith('http://') || data.startsWith('https://')) {
        targetUrl = data;
        isTemporaryBlobUrl = false;
      } else {
        // Raw text content
        const blob = new Blob([data], { type: mimeType || 'text/plain;charset=utf-8' });
        targetUrl = URL.createObjectURL(blob);
        isTemporaryBlobUrl = true;
      }
    } else if (typeof data === 'object' && data !== null && data instanceof Blob) {
      targetUrl = URL.createObjectURL(data);
      isTemporaryBlobUrl = true;
    } else {
      throw new Error('Unsupported data format for download.');
    }

    // 5. Trigger browser download securely
    const anchor = document.createElement('a');
    anchor.href = targetUrl;
    anchor.download = cleanFilename;
    anchor.style.position = 'absolute';
    anchor.style.left = '-9999px';
    anchor.style.opacity = '0';
    // Strictly protect download action from popunder script listeners
    anchor.classList.add('no-popunder');
    anchor.setAttribute('data-action', 'download');

    document.body.appendChild(anchor);
    anchor.click();

    // 6. Clean up anchor and Object URLs
    setTimeout(() => {
      try {
        if (anchor.parentNode) {
          anchor.parentNode.removeChild(anchor);
        }
        if (isTemporaryBlobUrl) {
          URL.revokeObjectURL(targetUrl);
        }
      } catch {}
    }, 1500);

    // 7. Track analytics event
    if (toolSlug) {
      try {
        trackEvent('download', { tool: toolSlug, filename: cleanFilename });
      } catch {}
    }

    onStatusChange?.('completed', 'Download started!');
    notifyListeners(false, cleanFilename, null);
    return true;
  } catch (err: any) {
    console.error('[DownloadManager] Download failed:', err);
    onStatusChange?.('error', err?.message || 'Download failed');
    notifyListeners(false, null, null);
    return false;
  } finally {
    // Release debounce lock after 1.2s to permit legitimate subsequent downloads
    setTimeout(() => {
      activeDownloads.delete(cleanFilename);
    }, 1200);
  }
}

/**
 * Convenience helper to download a Blob
 */
export function downloadBlob(blob: Blob, filename: string, toolSlug?: string): Promise<boolean> {
  return executeSmartDownload({ data: blob, filename, toolSlug });
}

/**
 * Convenience helper to download a Data URL (base64)
 */
export function downloadDataUrl(dataUrl: string, filename: string, toolSlug?: string): Promise<boolean> {
  return executeSmartDownload({ data: dataUrl, filename, toolSlug });
}

/**
 * Convenience helper to download raw string / text content
 */
export function downloadText(content: string, filename: string, mimeType?: string, toolSlug?: string): Promise<boolean> {
  return executeSmartDownload({ data: content, filename, mimeType, toolSlug });
}

/**
 * Convenience helper to download an existing URL
 */
export function downloadUrl(url: string, filename: string, toolSlug?: string): Promise<boolean> {
  return executeSmartDownload({ data: url, filename, toolSlug });
}
