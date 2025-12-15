import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Layers, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface PersonalizationArea {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  logoWidth: number;
  logoHeight: number;
  logoPreview: string | null;
}

interface MultiAreaManagerProps {
  areas: PersonalizationArea[];
  activeAreaId: string | null;
  onAreasChange: (areas: PersonalizationArea[]) => void;
  onActiveAreaChange: (areaId: string | null) => void;
  onLogoUpload: (areaId: string, file: File) => void;
}

const DEFAULT_AREA_NAMES = [
  "Frente",
  "Verso",
  "Lateral Esquerda",
  "Lateral Direita",
  "Tampa",
  "Base",
  "Bolso",
  "Alça",
];

export function MultiAreaManager({
  areas,
  activeAreaId,
  onAreasChange,
  onActiveAreaChange,
  onLogoUpload,
}: MultiAreaManagerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addArea = () => {
    const usedNames = areas.map((a) => a.name);
    const availableName = DEFAULT_AREA_NAMES.find((n) => !usedNames.includes(n)) || `Área ${areas.length + 1}`;
    
    const newArea: PersonalizationArea = {
      id: crypto.randomUUID(),
      name: availableName,
      positionX: 50,
      positionY: 50,
      logoWidth: 5,
      logoHeight: 3,
      logoPreview: null,
    };
    
    const updatedAreas = [...areas, newArea];
    onAreasChange(updatedAreas);
    onActiveAreaChange(newArea.id);
  };

  const removeArea = (areaId: string) => {
    if (areas.length <= 1) return;
    
    const updatedAreas = areas.filter((a) => a.id !== areaId);
    onAreasChange(updatedAreas);
    
    if (activeAreaId === areaId) {
      onActiveAreaChange(updatedAreas[0]?.id || null);
    }
  };

  const updateAreaName = (areaId: string, name: string) => {
    const updatedAreas = areas.map((a) =>
      a.id === areaId ? { ...a, name } : a
    );
    onAreasChange(updatedAreas);
  };

  const handleLogoUpload = (areaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    onLogoUpload(areaId, file);
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer hover:opacity-80">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Áreas de Personalização</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {areas.length} {areas.length === 1 ? "área" : "áreas"}
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CardDescription className="text-xs">
            Adicione múltiplas áreas para personalizar (ex: frente, verso)
          </CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-3 pt-0">
            {/* Areas list */}
            <div className="space-y-2">
              {areas.map((area, index) => (
                <div
                  key={area.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer",
                    activeAreaId === area.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                  onClick={() => onActiveAreaChange(area.id)}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Input
                      value={area.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateAreaName(area.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-7 text-sm border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="Nome da área"
                    />
                  </div>

                  {/* Logo indicator */}
                  {area.logoPreview ? (
                    <div className="h-6 w-6 rounded border bg-background overflow-hidden flex-shrink-0">
                      <img
                        src={area.logoPreview}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleLogoUpload(area.id, e);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        id={`logo-upload-${area.id}`}
                      />
                      <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent">
                        + Logo
                      </Badge>
                    </div>
                  )}

                  {/* Position indicator */}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {area.positionX}%, {area.positionY}%
                  </div>

                  {/* Remove button */}
                  {areas.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeArea(area.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add area button */}
            <Button
              variant="outline"
              size="sm"
              onClick={addArea}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Área
            </Button>

            {/* Quick add buttons */}
            <div className="flex flex-wrap gap-1">
              {DEFAULT_AREA_NAMES.filter(
                (name) => !areas.some((a) => a.name === name)
              )
                .slice(0, 4)
                .map((name) => (
                  <Button
                    key={name}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() => {
                      const newArea: PersonalizationArea = {
                        id: crypto.randomUUID(),
                        name,
                        positionX: 50,
                        positionY: 50,
                        logoWidth: 5,
                        logoHeight: 3,
                        logoPreview: null,
                      };
                      onAreasChange([...areas, newArea]);
                      onActiveAreaChange(newArea.id);
                    }}
                  >
                    + {name}
                  </Button>
                ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
