import { useCallback } from "react";
import { COLORS, CATEGORIES, SUPPLIERS, MATERIAIS } from "@/data/mockData";
import { FilterState } from "@/components/filters/FilterPanel";

export interface VoiceCommand {
  type: "filter" | "sort" | "clear" | "search" | "navigate" | "unknown";
  action?: string;
  value?: string | string[];
  filterKey?: keyof FilterState;
  sortValue?: string;
}

// Normalize text for comparison (remove accents, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// Find color by name (fuzzy match)
const findColor = (colorName: string): string | null => {
  const normalized = normalizeText(colorName);
  const color = COLORS.find(
    (c) =>
      normalizeText(c.name) === normalized ||
      normalizeText(c.name).includes(normalized) ||
      normalized.includes(normalizeText(c.name))
  );
  return color?.name || null;
};

// Find category by name (fuzzy match)
const findCategory = (categoryName: string): number | null => {
  const normalized = normalizeText(categoryName);
  const category = CATEGORIES.find(
    (c) =>
      normalizeText(c.name) === normalized ||
      normalizeText(c.name).includes(normalized) ||
      normalized.includes(normalizeText(c.name))
  );
  return category?.id ?? null;
};

// Find supplier by name (fuzzy match)
const findSupplier = (supplierName: string): string | null => {
  const normalized = normalizeText(supplierName);
  const supplier = SUPPLIERS.find(
    (s) =>
      normalizeText(s.name) === normalized ||
      normalizeText(s.name).includes(normalized) ||
      normalized.includes(normalizeText(s.name))
  );
  return supplier?.id || null;
};

// Find material by name (fuzzy match)
const findMaterial = (materialName: string): string | null => {
  const normalized = normalizeText(materialName);
  const material = MATERIAIS.find(
    (m) =>
      normalizeText(m) === normalized ||
      normalizeText(m).includes(normalized) ||
      normalized.includes(normalizeText(m))
  );
  return material || null;
};

export function useVoiceCommands() {
  const parseCommand = useCallback((transcript: string): VoiceCommand => {
    const normalized = normalizeText(transcript);

    // Clear/Reset commands
    if (
      normalized.includes("limpar") ||
      normalized.includes("resetar") ||
      normalized.includes("remover filtros") ||
      normalized.includes("limpar filtros")
    ) {
      return { type: "clear", action: "reset" };
    }

    // Sort commands
    if (normalized.includes("ordenar") || normalized.includes("ordem")) {
      if (normalized.includes("preco") || normalized.includes("valor")) {
        if (normalized.includes("maior") || normalized.includes("caro") || normalized.includes("alto")) {
          return { type: "sort", sortValue: "price-desc", action: "Ordenar por maior preço" };
        }
        if (normalized.includes("menor") || normalized.includes("barato") || normalized.includes("baixo")) {
          return { type: "sort", sortValue: "price-asc", action: "Ordenar por menor preço" };
        }
        return { type: "sort", sortValue: "price-asc", action: "Ordenar por preço" };
      }
      if (normalized.includes("nome") || normalized.includes("alfabetica")) {
        return { type: "sort", sortValue: "name", action: "Ordenar por nome" };
      }
      if (normalized.includes("estoque")) {
        return { type: "sort", sortValue: "stock", action: "Ordenar por estoque" };
      }
    }

    // Filter by color
    if (normalized.includes("cor") || normalized.includes("filtrar")) {
      // Extract color name from common patterns
      const colorPatterns = [
        /filtrar\s+(?:por\s+)?cor\s+(\w+)/,
        /cor\s+(\w+)/,
        /(?:so|apenas|somente)\s+(\w+)/,
        /mostrar\s+(\w+)/,
      ];

      for (const pattern of colorPatterns) {
        const match = normalized.match(pattern);
        if (match) {
          const colorName = match[1];
          const foundColor = findColor(colorName);
          if (foundColor) {
            return {
              type: "filter",
              filterKey: "colors",
              value: [foundColor],
              action: `Filtrar por cor ${foundColor}`,
            };
          }
        }
      }

      // Check for common color names directly
      const commonColors = ["azul", "vermelho", "verde", "amarelo", "preto", "branco", "rosa", "roxo", "laranja", "cinza"];
      for (const colorName of commonColors) {
        if (normalized.includes(colorName)) {
          const foundColor = findColor(colorName);
          if (foundColor) {
            return {
              type: "filter",
              filterKey: "colors",
              value: [foundColor],
              action: `Filtrar por cor ${foundColor}`,
            };
          }
        }
      }
    }

    // Filter by category
    if (normalized.includes("categoria") || normalized.includes("tipo")) {
      const categoryPatterns = [
        /categoria\s+(\w+)/,
        /tipo\s+(\w+)/,
        /(?:so|apenas)\s+(\w+)/,
      ];

      for (const pattern of categoryPatterns) {
        const match = normalized.match(pattern);
        if (match) {
          const categoryName = match[1];
          const foundCategory = findCategory(categoryName);
          if (foundCategory !== null) {
            return {
              type: "filter",
              filterKey: "categories",
              value: [foundCategory.toString()],
              action: `Filtrar por categoria`,
            };
          }
        }
      }
    }

    // Filter by material
    if (normalized.includes("material")) {
      const materialPatterns = [
        /material\s+(\w+)/,
        /(?:de|em)\s+(\w+)/,
      ];

      for (const pattern of materialPatterns) {
        const match = normalized.match(pattern);
        if (match) {
          const materialName = match[1];
          const foundMaterial = findMaterial(materialName);
          if (foundMaterial) {
            return {
              type: "filter",
              filterKey: "materiais",
              value: [foundMaterial],
              action: `Filtrar por material ${foundMaterial}`,
            };
          }
        }
      }
    }

    // Filter by price range
    if (normalized.includes("preco") || normalized.includes("valor") || normalized.includes("reais")) {
      // "até 50 reais", "menos de 100", "abaixo de 200"
      const pricePatterns = [
        /(?:ate|menos\s+de|abaixo\s+de)\s+(\d+)/,
        /(\d+)\s+(?:reais|r\$)/,
      ];

      for (const pattern of pricePatterns) {
        const match = normalized.match(pattern);
        if (match) {
          const maxPrice = parseInt(match[1]);
          return {
            type: "filter",
            filterKey: "priceRange",
            value: ["0", maxPrice.toString()],
            action: `Filtrar até R$ ${maxPrice}`,
          };
        }
      }
    }

    // Quick filters
    if (normalized.includes("kit") || normalized.includes("kits")) {
      return {
        type: "filter",
        filterKey: "isKit",
        value: ["true"],
        action: "Mostrar apenas kits",
      };
    }

    if (normalized.includes("estoque") || normalized.includes("disponivel")) {
      return {
        type: "filter",
        filterKey: "inStock",
        value: ["true"],
        action: "Mostrar apenas em estoque",
      };
    }

    if (normalized.includes("destaque") || normalized.includes("destacado")) {
      return {
        type: "filter",
        filterKey: "featured",
        value: ["true"],
        action: "Mostrar apenas destaques",
      };
    }

    // Search command - use the entire transcript as search query
    if (normalized.includes("buscar") || normalized.includes("procurar") || normalized.includes("pesquisar")) {
      const searchPatterns = [
        /(?:buscar|procurar|pesquisar)\s+(.+)/,
      ];

      for (const pattern of searchPatterns) {
        const match = normalized.match(pattern);
        if (match) {
          return {
            type: "search",
            value: match[1],
            action: `Buscar "${match[1]}"`,
          };
        }
      }
    }

    // If no command matched, treat as search
    return {
      type: "search",
      value: transcript,
      action: `Buscar "${transcript}"`,
    };
  }, []);

  return { parseCommand };
}
