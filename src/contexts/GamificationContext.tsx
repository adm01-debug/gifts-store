import { createContext, useContext, ReactNode } from "react";

interface GamificationContextType {
  // Placeholder - extend as needed
}

const GamificationContext = createContext<GamificationContextType | null>(null);

interface GamificationProviderProps {
  children: ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  return (
    <GamificationContext.Provider value={{}}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
