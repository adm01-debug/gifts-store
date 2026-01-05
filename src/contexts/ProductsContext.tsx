import { createContext, useContext, ReactNode } from "react";

// Stub context - implementar lógica de produtos quando necessário
interface ProductsContextType {
  products: never[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const value: ProductsContextType = {
    products: [],
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
