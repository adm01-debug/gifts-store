import { ReactNode } from "react";

interface GamificationProviderProps {
  children: ReactNode;
}

// Este provider é um passthrough - a lógica real está no hook useGamification
export function GamificationProvider({ children }: GamificationProviderProps) {
  return <>{children}</>;
}
