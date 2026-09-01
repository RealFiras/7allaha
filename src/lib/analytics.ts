/**
 * Google Analytics 4 (GA4) Analytics & Privacy Management
 * 
 * Provides GDPR/Privacy compliant GA4 tracking with:
 * - Dynamic gtag script injection
 * - User consent management (opt-in / opt-out)
 * - Anonymized IP and secure cookies
 * - Virtual pageview tracking for SPA routes
 * - Custom event dispatchers for tool usage, conversions & searches
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const CONSENT_STORAGE_KEY = 'adawaty_ga_consent';

export const GA_MEASUREMENT_ID =
  ((import.meta as unknown as { env?: { VITE_GA_MEASUREMENT_ID?: string } }).env?.VITE_GA_MEASUREMENT_ID) || 'G-ADAWATY2026';

export type ConsentStatus = 'granted' | 'denied' | 'unset';

/**
 * Retrieves the current user consent status for Google Analytics
 */
export function getConsentStatus(): ConsentStatus {
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved === 'granted' || saved === 'denied') {
      return saved;
    }
  } catch (e) {
    console.error('Error reading consent status:', e);
  }
  return 'unset';
}

/**
 * Updates user consent and initializes or disables GA accordingly
 */
export function setConsentStatus(status: 'granted' | 'denied'): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    if (status === 'granted') {
      initGA();
    } else {
      disableGA();
    }
  } catch (e) {
    console.error('Error saving consent status:', e);
  }
}

let isInitialized = false;

/**
 * Initializes Google Analytics 4 if consent is granted or not explicitly denied
 */
export function initGA(forcedId?: string): void {
  if (typeof window === 'undefined') return;

  const measurementId = forcedId || GA_MEASUREMENT_ID;
  if (!measurementId || measurementId.trim() === '') return;

  const consent = getConsentStatus();
  // If user explicitly denied, do not initialize
  if (consent === 'denied') return;

  // Initialize dataLayer and gtag if not present
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = window.gtag || gtag;

  if (!isInitialized) {
    window.gtag('js', new Date());

    // Configure privacy settings: Anonymize IP & Secure cookies
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      send_page_view: false, // We will manually track page views for SPA routes
    });

    // Check if script already in DOM
    const existingScript = document.getElementById('ga-gtag-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'ga-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    isInitialized = true;
  }
}

/**
 * Disables tracking when user denies consent
 */
export function disableGA(): void {
  if (typeof window === 'undefined') return;
  const measurementId = GA_MEASUREMENT_ID;
  // Set the window opt-out property for GA
  (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = true;
}

/**
 * Tracks a virtual page view in Google Analytics
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return;
  
  // Ensure GA is initialized if consent is given or not denied
  if (!isInitialized && getConsentStatus() !== 'denied') {
    initGA();
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });
  }
}

/**
 * Dispatches a custom GA4 event (e.g. tool interaction, calculation, copy, share)
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === 'undefined') return;

  if (getConsentStatus() === 'denied') return;

  if (!isInitialized) {
    initGA();
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Specific helper for tool usage tracking
 */
export function trackToolUsage(toolId: string, toolName: string, actionType: string = 'calculate'): void {
  trackEvent('tool_used', {
    tool_id: toolId,
    tool_name: toolName,
    action_type: actionType,
  });
}
