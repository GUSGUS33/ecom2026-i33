import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { RequireAuth } from "./components/RequireAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./lib/apollo";
import { HelmetProvider } from "react-helmet-async";
import { MainLayout } from "./layouts/MainLayout";
import { lazy, Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import superjson from "superjson";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const QuotePage = lazy(() => import("./pages/QuotePage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const DemoPricing = lazy(() => import("./pages/DemoPricing"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const MiCuenta = lazy(() => import("./pages/MiCuenta"));
const PrivateHome = lazy(() => import("./pages/PrivateHome"));

// Ecommerce pages
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          
          {/* Rutas de Autenticación */}
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/forgot-password" component={ForgotPassword} />
          <Route path="/auth/reset-password" component={ResetPassword} />
          
          {/* Rutas Protegidas */}
          <Route path="/inicio">
            {() => (
              <RequireAuth>
                <PrivateHome />
              </RequireAuth>
            )}
          </Route>
          <Route path="/mi-cuenta">
            {() => (
              <RequireAuth>
                <MiCuenta />
              </RequireAuth>
            )}
          </Route>
          <Route path="/mis-favoritos">
            {() => (
              <RequireAuth>
                <FavoritesPage />
              </RequireAuth>
            )}
          </Route>
          <Route path="/carrito">
            {() => (
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            )}
          </Route>
          <Route path="/checkout">
            {() => (
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            )}
          </Route>
          <Route path="/mis-pedidos">
            {() => (
              <RequireAuth>
                <OrdersPage />
              </RequireAuth>
            )}
          </Route>
          <Route path="/mi-perfil">
            {() => (
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            )}
          </Route>
          
          {/* Rutas de Producto - IMPORTANTE: Definir antes de las categorías genéricas para evitar conflictos */}
          <Route path="/producto/:slug" component={ProductPage} />
          <Route path="/demo-pricing" component={DemoPricing} />

          {/* Rutas Legales e Info - IMPORTANTE: Definir ANTES de las rutas dinámicas de categorías */}
          <Route path="/contacto" component={ContactPage} />
          <Route path="/presupuesto-rapido" component={QuotePage} />
          
          {/* Rutas de Servicios */}
          <Route path="/servicios/:slug" component={ServicePage} />

          {/* Páginas de Información Estáticas */}
          <Route path="/quienes-somos" component={InfoPage} />
          <Route path="/plazos-de-entrega" component={InfoPage} />
          <Route path="/enviar-archivos" component={InfoPage} />
          <Route path="/formas-de-pago" component={InfoPage} />
          <Route path="/tarifa-portes" component={InfoPage} />
          <Route path="/precios" component={InfoPage} />
          <Route path="/garantia-de-calidad" component={InfoPage} />
          <Route path="/trabajos-realizados" component={InfoPage} />
          <Route path="/marcas" component={InfoPage} />
          <Route path="/condiciones-generales" component={InfoPage} />
          <Route path="/politica-privacidad" component={InfoPage} />
          <Route path="/cookies" component={InfoPage} />
          <Route path="/aviso-legal" component={InfoPage} />
          <Route path="/preguntas-frecuentes" component={InfoPage} />
          <Route path="/blog" component={InfoPage} />

          {/* Rutas de Categorías Transaccionales */}
          {/* Captura /categoria/, /categoria/subcategoria/ y /categoria/subcategoria/child/ */}
          <Route path="/:category" component={CategoryPage} />
          <Route path="/:category/:subcategory" component={CategoryPage} />
          <Route path="/:category/:subcategory/:child" component={CategoryPage} />
          
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </MainLayout>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <HelmetProvider>
              <ThemeProvider defaultTheme="light">
                <QuoteProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Router />
                  </TooltipProvider>
                </QuoteProvider>
              </ThemeProvider>
            </HelmetProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

export default App;
