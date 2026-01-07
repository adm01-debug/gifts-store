import { useState } from "react";
import { useClientNotes, ClientNote } from "@/hooks/useClientNotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, Phone, Mail, Calendar, Pin, Plus, Send,
  MoreHorizontal, Trash2, PinOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const NOTE_TYPES = {
  general: { label: "Geral", icon: MessageSquare, color: "bg-gray-500" },
  meeting: { label: "Reunião", icon: Calendar, color: "bg-blue-500" },
  call: { label: "Ligação", icon: Phone, color: "bg-green-500" },
  email: { label: "E-mail", icon: Mail, color: "bg-purple-500" },
  task: { label: "Tarefa", icon: Calendar, color: "bg-orange-500" },
};

interface ClientNotesTimelineProps {
  clientId: string;
  className?: string;
}

export function ClientNotesTimeline({ clientId, className }: ClientNotesTimelineProps) {
  const { 
    notes, 
    pinnedNotes, 
    isLoading, 
    createNote, 
    togglePin, 
    deleteNote 
  } = useClientNotes(clientId);
  
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<ClientNote["note_type"]>("general");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    
    await createNote.mutateAsync({
      content: newNote,
      note_type: noteType,
    });
    
    setNewNote("");
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Notas e Histórico</CardTitle>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova Nota
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Add Note Form */}
        {isAdding && (
          <div className="mb-4 p-3 border rounded-lg space-y-3">
            <div className="flex gap-2">
              <Select value={noteType} onValueChange={(v) => setNoteType(v as ClientNote["note_type"])}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NOTE_TYPES).map(([key, { label, icon: Icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escreva sua nota..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!newNote.trim()}>
                <Send className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Pin className="h-4 w-4" />
              Fixadas
            </h4>
            <div className="space-y-2">
              {pinnedNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onTogglePin={() => togglePin.mutate({ noteId: note.id, isPinned: true })}
                  onDelete={() => deleteNote.mutate(note.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3">
          {notes.filter(n => !n.is_pinned).map((note) => (
            <NoteCard 
              key={note.id} 
              note={note}
              onTogglePin={() => togglePin.mutate({ noteId: note.id, isPinned: false })}
              onDelete={() => deleteNote.mutate(note.id)}
            />
          ))}
        </div>

        {notes.length === 0 && !isAdding && (
          <p className="text-muted-foreground text-sm text-center py-4">
            Nenhuma nota registrada
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function NoteCard({ 
  note, 
  onTogglePin, 
  onDelete 
}: { 
  note: ClientNote; 
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  const typeInfo = NOTE_TYPES[note.note_type];
  const Icon = typeInfo.icon;

  return (
    <div className={cn(
      "p-3 rounded-lg border",
      note.is_pinned && "bg-muted/50"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className={cn("p-1.5 rounded", typeInfo.color)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {typeInfo.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(note.created_at), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            {note.author && (
              <p className="text-xs text-muted-foreground mt-1">
                Por {note.author.full_name}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onTogglePin}>
              {note.is_pinned ? (
                <>
                  <PinOff className="h-4 w-4 mr-2" />
                  Desafixar
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4 mr-2" />
                  Fixar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
