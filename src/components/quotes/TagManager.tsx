// src/components/quotes/TagManager.tsx

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagManagerProps {
  /** Tags atuais */
  tags: string[];
  /** Callback quando tags mudam */
  onChange: (tags: string[]) => void;
  /** Sugestões de tags pré-definidas */
  suggestions?: string[];
  /** Máximo de tags permitidas */
  maxTags?: number;
  /** Modo de exibição: inline (para lista) ou full (para formulário) */
  mode?: "inline" | "full";
  /** Classe CSS adicional */
  className?: string;
}

// Tags pré-definidas sugeridas
const DEFAULT_TAG_SUGGESTIONS = [
  "Urgente",
  "VIP",
  "Evento",
  "Corporativo",
  "Governo",
  "Educação",
  "Saúde",
  "Tecnologia",
  "Brinde Ecológico",
  "Alta Margem",
  "Recorrente",
  "Primeira Compra",
  "Black Friday",
  "Natal",
  "Ano Novo"
];

// Cores para as tags (rotação automática)
const TAG_COLORS = [
  "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "bg-green-100 text-green-800 hover:bg-green-200",
  "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "bg-orange-100 text-orange-800 hover:bg-orange-200",
  "bg-pink-100 text-pink-800 hover:bg-pink-200",
  "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "bg-red-100 text-red-800 hover:bg-red-200"
];

export function TagManager({
  tags = [],
  onChange,
  suggestions = DEFAULT_TAG_SUGGESTIONS,
  maxTags = 10,
  mode = "inline",
  className = ""
}: TagManagerProps) {
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Adicionar tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      return; // Tag já existe
    }

    if (tags.length >= maxTags) {
      return; // Limite atingido
    }

    onChange([...tags, trimmedTag]);
    setNewTag("");
  };

  // Remover tag
  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  // Adicionar tag ao pressionar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  // Cor da tag baseada no índice
  const getTagColor = (index: number) => {
    return TAG_COLORS[index % TAG_COLORS.length];
  };

  // Modo inline (para lista compacta)
  if (mode === "inline") {
    return (
      <div className={cn("flex items-center gap-2 flex-wrap", className)}>
        {tags.map((tag, index) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn("text-xs", getTagColor(index))}
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
        
        {tags.length === 0 && (
          <span className="text-xs text-muted-foreground italic">
            Sem tags
          </span>
        )}
      </div>
    );
  }

  // Modo full (para formulário com edição)
  return (
    <div className={cn("space-y-3", className)}>
      {/* Tags atuais */}
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn(
              "text-xs cursor-pointer group",
              getTagColor(index)
            )}
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground italic">
            Nenhuma tag adicionada
          </span>
        )}
      </div>

      {/* Input para adicionar tag */}
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Nova Tag</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o nome da tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      addTag(newTag);
                      setIsOpen(false);
                    }}
                    disabled={!newTag.trim() || tags.length >= maxTags}
                  >
                    Adicionar
                  </Button>
                </div>
                {tags.length >= maxTags && (
                  <p className="text-xs text-destructive mt-2">
                    Limite de {maxTags} tags atingido
                  </p>
                )}
              </div>

              {/* Sugestões */}
              <div>
                <h4 className="font-medium text-sm mb-2">Sugestões</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions
                    .filter(s => !tags.includes(s))
                    .slice(0, 10)
                    .map((suggestion, index) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className={cn(
                          "cursor-pointer hover:bg-accent text-xs",
                          getTagColor(index)
                        )}
                        onClick={() => {
                          addTag(suggestion);
                          setIsOpen(false);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

/**
 * Componente para filtrar por tags
 */
export function TagFilter({
  selectedTags,
  onTagsChange,
  availableTags,
  className = ""
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  className?: string;
}) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">Filtrar por tags:</p>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-xs",
                !isSelected && TAG_COLORS[index % TAG_COLORS.length]
              )}
              onClick={() => toggleTag(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          );
        })}
        
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTagsChange([])}
            className="h-6 text-xs"
          >
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
