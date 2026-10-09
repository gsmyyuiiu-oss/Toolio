// Privacy-preserving aggregate event tracker (No PII, zero tracking cookies)

export type AnalyticsEventType =
  | 'tool_open'
  | 'tool_complete'
  | 'download'
  | 'copy_result'
  | 'language_change'
  | 'search'
  | 'category_click';

export function trackEvent(eventType: AnalyticsEventType, details?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  // Custom event dispatcher for aggregate observation
  try {
    const event = new CustomEvent('toolio_analytics', {
      detail: {
        type: eventType,
        timestamp: Date.now(),
        ...details,
      },
    });
    window.dispatchEvent(event);
  } catch {
    // ignore
  }
}
