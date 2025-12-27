import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupLocale } from "./lib/locale-config";

// Configurar locale pt-BR antes de renderizar
setupLocale();

createRoot(document.getElementById("root")!).render(<App />);
