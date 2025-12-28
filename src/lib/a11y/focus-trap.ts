export function createFocusTrap(element: HTMLElement) {{
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleTab(e: KeyboardEvent) {{
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {{
      if (document.activeElement === firstElement) {{
        lastElement.focus();
        e.preventDefault();
      }}
    }} else {{
      if (document.activeElement === lastElement) {{
        firstElement.focus();
        e.preventDefault();
      }}
    }}
  }}

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}}
