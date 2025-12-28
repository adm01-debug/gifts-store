import { Loader2 } from 'lucide-react';
export function LoadingState({ text = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
