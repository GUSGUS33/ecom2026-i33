import HomeClient from "./HomeClient";

// Forzar renderizado dinámico para evitar prerendering estático
// que falla porque Home usa hooks de Apollo/wouter sin providers
export const dynamic = "force-dynamic";

/**
 * Home page - Server Component wrapper
 * TODO: Migrar a Server Component con datos pre-fetched en una fase posterior
 */
export default function HomePage() {
  return <HomeClient />;
}
