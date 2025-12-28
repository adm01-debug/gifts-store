import { initGA4 } from '@/integrations/analytics/GoogleAnalytics';
import { track as mixpanelTrack } from '@/integrations/analytics/Mixpanel';

export enum EventCategory {
  QUOTE = 'quote',
  PRODUCT = 'product',
  USER = 'user',
  CONVERSION = 'conversion',
  NAVIGATION = 'navigation',
  ERROR = 'error'
}

interface TrackEventParams {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export class EventTracker {
  private static instance: EventTracker;
  private enabled: boolean = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';
  
  private constructor() {
    if (this.enabled) {
      this.initializeAnalytics();
    }
  }
  
  static getInstance(): EventTracker {
    if (!this.instance) {
      this.instance = new EventTracker();
    }
    return this.instance;
  }

  private initializeAnalytics(): void {
    // Initialize GA4
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA4();
    }
  }

  track({ category, action, label, value, metadata }: TrackEventParams): void {
    if (!this.enabled) return;

    const eventName = `${category}_${action}`;
    const properties = {
      category,
      label,
      value,
      ...metadata,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer
    };

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
        ...metadata
      });
    }

    // Send to Mixpanel
    try {
      mixpanelTrack(eventName, properties);
    } catch (error) {
      console.error('Mixpanel tracking error:', error);
    }

    // Console log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, properties);
    }
  }

  // Quote events
  trackQuoteCreated(quoteId: string, value: number): void {
    this.track({
      category: EventCategory.QUOTE,
      action: 'created',
      label: quoteId,
      value,
      metadata: { quoteId }
    });
  }

  trackQuoteApproved(quoteId: string, value: number): void {
    this.track({
      category: EventCategory.CONVERSION,
      action: 'quote_approved',
      label: quoteId,
      value,
      metadata: { quoteId }
    });
  }

  trackQuoteShared(quoteId: string, channel: string): void {
    this.track({
      category: EventCategory.QUOTE,
      action: 'shared',
      label: quoteId,
      metadata: { quoteId, channel }
    });
  }

  // Product events
  trackProductViewed(productId: string, productName: string): void {
    this.track({
      category: EventCategory.PRODUCT,
      action: 'viewed',
      label: productId,
      metadata: { productId, productName }
    });
  }

  trackProductAddedToQuote(productId: string, productName: string, quantity: number): void {
    this.track({
      category: EventCategory.PRODUCT,
      action: 'added_to_quote',
      label: productId,
      value: quantity,
      metadata: { productId, productName, quantity }
    });
  }

  trackProductSearched(query: string, resultsCount: number): void {
    this.track({
      category: EventCategory.PRODUCT,
      action: 'searched',
      label: query,
      value: resultsCount,
      metadata: { query, resultsCount }
    });
  }

  // User events
  trackUserLogin(userId: string): void {
    this.track({
      category: EventCategory.USER,
      action: 'login',
      label: userId,
      metadata: { userId }
    });
  }

  trackUserSignup(userId: string): void {
    this.track({
      category: EventCategory.CONVERSION,
      action: 'signup',
      label: userId,
      metadata: { userId }
    });
  }

  // Navigation events
  trackPageView(path: string): void {
    this.track({
      category: EventCategory.NAVIGATION,
      action: 'page_view',
      label: path,
      metadata: { path }
    });
  }

  // Error events
  trackError(errorName: string, errorMessage: string): void {
    this.track({
      category: EventCategory.ERROR,
      action: errorName,
      label: errorMessage,
      metadata: { errorName, errorMessage }
    });
  }

  // Custom event
  trackCustomEvent(action: string, metadata?: Record<string, any>): void {
    this.track({
      category: EventCategory.USER,
      action,
      metadata
    });
  }

  // Set user properties
  setUserProperties(userId: string, properties: Record<string, any>): void {
    if (!this.enabled) return;

    if (window.gtag) {
      window.gtag('set', { user_id: userId, user_properties: properties });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] User properties set:', userId, properties);
    }
  }
}

export const analytics = EventTracker.getInstance();
