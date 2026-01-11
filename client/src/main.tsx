import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { initializeAnalytics } from "./lib/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Initialize analytics (Umami) if configured
initializeAnalytics();

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </ApolloProvider>
);
