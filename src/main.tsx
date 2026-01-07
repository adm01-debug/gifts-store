import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerServiceWorker } from "@/lib/sw-register";
import { ErrorBoundary } from "@/components/errors";
import App from "./App.tsx";
import "./index.css";
import { setupLocale } from "./lib/locale-config";

// Configurar locale pt-BR antes de renderizar
try {
  setupLocale();
} catch (error) {
  if (import.meta.env.DEV) {
    console.error('❌ Erro ao configurar locale:', error);
  }
}

const root = document.getElementById("root");

if (!root) {
  throw new Error('❌ Elemento root não encontrado no DOM');
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  registerServiceWorker()
    .then(() => {
      if (import.meta.env.DEV) {
        console.log('✅ Service Worker registrado com sucesso');
      }
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.error('❌ Erro ao registrar Service Worker:', error);
      }
    });
}
