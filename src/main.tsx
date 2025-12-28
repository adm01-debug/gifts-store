import { createRoot } from "react-dom/client";
import { registerServiceWorker } from "@/lib/sw-register";
import App from "./App.tsx";
import "./index.css";
import { setupLocale } from "./lib/locale-config";

// Configurar locale pt-BR antes de renderizar
setupLocale();

createRoot(document.getElementById("root")!).render(<App />);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  registerServiceWorker().then(() => {
    console.log('✅ Service Worker registrado com sucesso');
  }).catch((error) => {
    console.error('❌ Erro ao registrar Service Worker:', error);
  });
}
