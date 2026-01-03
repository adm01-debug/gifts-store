import { createContext, useContext, ReactNode } from "react";

interface ProductsContextType {
  // Placeholder - extend as needed
}

const ProductsContext = createContext<ProductsContextType | null>(null);

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  return (
    <ProductsContext.Provider value={{}}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
