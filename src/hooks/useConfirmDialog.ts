import { useState } from 'react';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  countdown?: number;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
  };

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel
  };
}

// Atalho para confirmações destrutivas
export function useDeleteConfirm() {
  const { confirm } = useConfirmDialog();

  return (itemName: string) => confirm({
    title: `Excluir ${itemName}?`,
    description: 'Esta ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
    variant: 'destructive',
    countdown: 3
  });
}
