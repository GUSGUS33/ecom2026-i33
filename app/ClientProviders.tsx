"use client";

import React, { Suspense } from "react";
import { Providers } from "./providers";

/**
 * ClientProviders wraps the heavy Providers in a Suspense boundary.
 * This allows Next.js to prerender _not-found without crashing when
 * hooks like usePathname() are called during static generation.
 * 
 * The Suspense boundary catches the error thrown by useSearchParams/usePathname
 * during prerendering and falls back to rendering children without providers.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div id="app-loading">{children}</div>}>
      <Providers>{children}</Providers>
    </Suspense>
  );
}
