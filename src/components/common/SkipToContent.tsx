/**
 * Skip to content link for accessibility (WCAG 2.1 AA)
 * Allows keyboard users to skip navigation and go directly to main content
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] 
                 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground
                 focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring
                 transition-all duration-200"
    >
      Ir para o conteúdo principal
    </a>
  );
}
