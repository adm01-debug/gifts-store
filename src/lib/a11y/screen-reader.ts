export function announceToScreenReader(message: string) {{
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}}

export function setAriaLabel(element: HTMLElement, label: string) {{
  element.setAttribute('aria-label', label);
}}
