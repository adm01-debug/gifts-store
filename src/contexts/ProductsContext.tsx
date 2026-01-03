import { ReactNode } from "react";

interface ProductsProviderProps {
  children: ReactNode;
}

// Este provider é um passthrough - a lógica real está no hook useProducts
export function ProductsProvider({ children }: ProductsProviderProps) {
  return <>{children}</>;
}
