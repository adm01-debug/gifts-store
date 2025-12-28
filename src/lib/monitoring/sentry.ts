import * as Sentry from '@sentry/react';

export function initSentry() {{
  Sentry.init({{
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  }});
}}

export {{ Sentry }};
