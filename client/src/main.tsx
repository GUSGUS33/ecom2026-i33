import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

/**
 * Punto de entrada de la aplicación.
 * 
 * Estructura de providers:
 * - AuthProvider (Supabase Auth) → se monta aquí para que esté disponible globalmente
 * - tRPC, QueryClient, Apollo, Helmet, Theme, etc. → se montan dentro de App.tsx
 * 
 * NOTA: No duplicar ApolloProvider ni HelmetProvider aquí porque ya están en App.tsx
 */
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
