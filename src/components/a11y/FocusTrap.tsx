import { useEffect, useRef, ReactNode, KeyboardEvent } from "react";

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

/**
 * Traps focus within a container for modal dialogs and overlays.
 * Ensures keyboard navigation stays within the component.
 */
export function FocusTrap({ 
  children, 
  active = true, 
  autoFocus = true,
  restoreFocus = true,
  className 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement;

    // Focus the first focusable element
    if (autoFocus && containerRef.current) {
      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }

    return () => {
      // Restore focus when unmounting
      if (restoreFocus && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, autoFocus, restoreFocus]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!active || e.key !== "Tab" || !containerRef.current) return;

    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length === 0) return;

    const firstElement = focusable[0] as HTMLElement;
    const lastElement = focusable[focusable.length - 1] as HTMLElement;

    if (e.shiftKey) {
      // Shift + Tab: if on first element, go to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      onKeyDown={handleKeyDown}
      className={className}
    >
      {children}
    </div>
  );
}

function getFocusableElements(container: HTMLElement): NodeListOf<Element> {
  return container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
  );
}

/**
 * Hook to manage focus within a component
 */
export function useFocusManagement() {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusFirst = () => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
  };

  const focusLast = () => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) {
      (focusable[focusable.length - 1] as HTMLElement).focus();
    }
  };

  const focusByIndex = (index: number) => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    if (index >= 0 && index < focusable.length) {
      (focusable[index] as HTMLElement).focus();
    }
  };

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusByIndex,
  };
}
