import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;
        const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Atalhos globais pré-configurados
export const GLOBAL_SHORTCUTS = {
  SEARCH: { key: 'k', ctrl: true, description: 'Busca global' },
  NEW_QUOTE: { key: 'n', ctrl: true, description: 'Novo orçamento' },
  EXPORT: { key: 'e', ctrl: true, description: 'Exportar' },
  PRINT: { key: 'p', ctrl: true, description: 'Imprimir' },
  CLOSE_MODAL: { key: 'Escape', description: 'Fechar modal' },
  SAVE: { key: 's', ctrl: true, description: 'Salvar' },
  FOCUS_SEARCH: { key: '/', description: 'Foco em busca' }
};
