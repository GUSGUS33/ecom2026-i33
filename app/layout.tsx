import type { Metadata } from "next";
import "@/index.css";
import { ClientProviders } from "./ClientProviders";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: "IMPACTO33 | Artículos Promocionales y Regalos Publicitarios Personalizados",
    template: "%s | IMPACTO33",
  },
  description:
    "Artículos promocionales y regalos publicitarios personalizados para empresas. Camisetas, tazas, bolsas, merchandising y más con tu logo. Precios mayoristas.",
  metadataBase: new URL("https://impacto33.com"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "IMPACTO33",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
