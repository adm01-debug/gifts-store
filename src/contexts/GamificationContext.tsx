import { createContext, useContext, ReactNode } from "react";

// Stub context - implementar lógica de gamificação quando necessário
interface GamificationContextType {
  points: number;
  level: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const value: GamificationContextType = {
    points: 0,
    level: 1,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
