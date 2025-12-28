import { securityHeaders } from './security-headers';

interface HelmetConfig {
  contentSecurityPolicy: boolean;
  crossOriginEmbedderPolicy: boolean;
  crossOriginOpenerPolicy: boolean;
  crossOriginResourcePolicy: boolean;
  dnsPrefetchControl: boolean;
  frameguard: boolean;
  hidePoweredBy: boolean;
  hsts: boolean;
  ieNoOpen: boolean;
  noSniff: boolean;
  referrerPolicy: boolean;
  xssFilter: boolean;
}

export const helmetConfig: HelmetConfig = {
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true,
};

export function initializeHelmet(): void {
  // Apply security headers on document load
  if (typeof document !== 'undefined') {
    // Remove X-Powered-By header indication
    const removePoweredBy = () => {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'X-Powered-By';
      meta.content = '';
      document.head.appendChild(meta);
    };

    removePoweredBy();
  }
}

export function validateSecurityHeaders(): boolean {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Strict-Transport-Security'
  ];

  return requiredHeaders.every(header => header in securityHeaders);
}
