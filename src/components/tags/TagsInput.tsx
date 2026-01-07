import { useState, useRef, KeyboardEvent } from "react";
import { useTags, Tag } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagsInput({ 
  value, 
  onChange, 
  placeholder = "Adicionar tag...",
  maxTags = 10,
  className 
}: TagsInputProps) {
  const { tags: availableTags, createTag, searchTags } = useTags();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);

    if (query.length >= 2) {
      const results = await searchTags(query);
      setSuggestions(results.filter(t => !value.find(v => v.id === t.id)));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1].id);
    }
  };

  const addTag = async (name: string) => {
    if (value.length >= maxTags) return;

    // Check if tag exists
    let tag = availableTags.find(t => t.name.toLowerCase() === name.toLowerCase());
    
    if (!tag) {
      // Create new tag
      const result = await createTag.mutateAsync({ name });
      tag = result as Tag;
    }

    if (tag && !value.find(v => v.id === tag!.id)) {
      onChange([...value, tag]);
    }

    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    onChange(value.filter(t => t.id !== tagId));
  };

  const selectSuggestion = (tag: Tag) => {
    if (value.length < maxTags) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px]">
        {value.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1">
            {tag.color && (
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: tag.color }}
              />
            )}
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {value.length < maxTags && (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] border-0 p-0 h-6 focus-visible:ring-0"
          />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-auto">
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => selectSuggestion(tag)}
              className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
            >
              {tag.color && (
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
              )}
              {tag.name}
              <span className="text-muted-foreground text-xs ml-auto">
                {tag.usage_count} usos
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-1">
        {value.length}/{maxTags} tags
      </p>
    </div>
  );
}
