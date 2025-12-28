import mixpanel from 'mixpanel-browser';

export function initMixpanel(token: string) {
  mixpanel.init(token);
}

export function trackEvent(event: string, properties?: any) {
  mixpanel.track(event, properties);
}
