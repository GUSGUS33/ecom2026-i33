/**
 * Analytics initialization module
 * Handles conditional loading of Umami analytics script
 * Only loads if VITE_ANALYTICS_WEBSITE_ID and VITE_ANALYTICS_ENDPOINT are defined
 */

export function initializeAnalytics(): void {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

  // Only load if both variables are defined
  if (!websiteId || !endpoint) {
    console.debug('📊 Analytics: VITE_ANALYTICS_WEBSITE_ID or VITE_ANALYTICS_ENDPOINT not configured. Umami will not load.');
    return;
  }

  try {
    const script = document.createElement('script');
    script.defer = true;
    script.src = `${endpoint}/umami`;
    script.dataset.websiteId = websiteId;
    script.async = true;

    document.body.appendChild(script);
    console.debug('📊 Analytics: Umami script loaded successfully.');
  } catch (error) {
    console.error('❌ Analytics: Failed to load Umami script:', error);
  }
}
