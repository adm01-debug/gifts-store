import { ProductColor } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

interface ClientColorPreferencesProps {
  primaryColor: ProductColor;
  secondaryColors: ProductColor[];
}

export function ClientColorPreferences({ primaryColor, secondaryColors }: ClientColorPreferencesProps) {
  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Cores do Cliente</h3>
      </div>

      {/* Cor primária */}
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Cor Primária</span>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border-2 border-border shadow-md"
            style={{ backgroundColor: primaryColor.hex }}
          />
          <div>
            <p className="font-medium text-foreground">{primaryColor.name}</p>
            <p className="text-xs text-muted-foreground uppercase">{primaryColor.hex}</p>
          </div>
        </div>
      </div>

      {/* Cores secundárias */}
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Cores Secundárias</span>
        <div className="flex flex-wrap gap-3">
          {secondaryColors.map((color, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 pr-4">
              <div
                className="w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm font-medium text-foreground">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Paleta completa */}
      <div className="pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mb-3 block">Paleta Completa</span>
        <div className="flex gap-1">
          <div
            className="flex-1 h-8 rounded-l-lg"
            style={{ backgroundColor: primaryColor.hex }}
          />
          {secondaryColors.map((color, index) => (
            <div
              key={index}
              className={`flex-1 h-8 ${index === secondaryColors.length - 1 ? 'rounded-r-lg' : ''}`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Tags de grupo de cor */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="outline" className="text-xs">
          {primaryColor.group}
        </Badge>
        {secondaryColors.map((color, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {color.group}
          </Badge>
        ))}
      </div>
    </div>
  );
}