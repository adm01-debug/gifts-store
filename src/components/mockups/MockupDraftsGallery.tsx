import { useMockupDrafts } from "@/hooks/useMockupDrafts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileImage, Star, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MockupDraftsGalleryProps { userId: string; onSelect?: (draft: any) => void; }

export function MockupDraftsGallery({ userId, onSelect }: MockupDraftsGalleryProps) {
  const { drafts, isLoading, deleteDraft } = useMockupDrafts(userId);

  if (isLoading) return <Card><CardContent className="py-8 text-center">Carregando...</CardContent></Card>;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5" />Rascunhos de Mockup</CardTitle></CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum rascunho salvo</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-primary" onClick={() => onSelect?.(draft)}>
                {draft.thumbnail_url ? <img src={draft.thumbnail_url} alt={draft.name} className="w-full h-32 object-cover" /> : <div className="w-full h-32 bg-muted flex items-center justify-center"><FileImage className="h-8 w-8 text-muted-foreground" /></div>}
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{draft.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true, locale: ptBR })}</p>
                </div>
                {draft.is_favorite && <Badge className="absolute top-2 right-2"><Star className="h-3 w-3" /></Badge>}
                <Button variant="destructive" size="icon" className="absolute top-2 left-2 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); deleteDraft.mutate(draft.id); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
