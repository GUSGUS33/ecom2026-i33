# Next Build Output Completo

## Versiones
- Next.js: 14.2.35
- React: 19.2.0
- React-DOM: 19.2.0

## Archivos clave actuales

### app/providers.tsx
- `"use client"` — sin patrón `mounted`
- Devuelve providers directamente (ErrorBoundary > trpc.Provider > QueryClientProvider > ApolloProvider > HelmetProvider > AuthProvider > ThemeProvider > QuoteProvider > NotificationProvider > TooltipProvider > MainLayout)

### app/layout.tsx
- Server Component
- Importa `@/index.css`
- Usa `<ClientProviders>{children}</ClientProviders>`

### app/ClientProviders.tsx
- `"use client"`
- Envuelve `<Providers>` en `<Suspense>`

### app/not-found.tsx
- Server Component puro (sin hooks, sin "use client")

## Output del build

```
⚠ You are using a non-standard "NODE_ENV" value in your environment.
▲ Next.js 14.2.35
- Experiments (use with caution):
  · missingSuspenseWithCSRBailout
Creating an optimized production build ...
✓ Compiled successfully
  Skipping validation of types
  Skipping linting
  Collecting page data ...
  Generating static pages (0/2) ...

TypeError: Cannot read properties of null (reading 'useContext')
    at t.useContext (next/dist/compiled/next-server/app-page.runtime.prod.js:12:109421)
    at d (.next/server/chunks/302.js:13:45648)
    at p (.next/server/chunks/302.js:13:37580)
    at au (next/dist/compiled/next-server/app-page.runtime.dev.js:35:10446)
    ...

Error occurred prerendering page "/_not-found".

[El mismo error se repite 3 veces]

✓ Generating static pages (2/2)
> Export encountered errors on following paths:
    /_not-found/page: /_not-found
```

## Análisis del chunk 302

La función `d()` en posición 45648 es:
```js
function d(){return(0,n.useContext)(o.PathnameContext)}
```

La función `p()` en posición 37580 es:
```js
function p(e){let{errorComponent:t,errorStyles:r,errorScripts:n,children:o}=e,s=(0,a.usePathname)()...
```

Esto es **código interno de Next.js** — un error boundary wrapper que llama a `usePathname()` durante el prerendering estático de `/_not-found`. No es nuestro código.

## Notas
- El error SOLO afecta a `/_not-found` — las páginas dinámicas (`/[slug]`, `/[slug]/[child]`) y la home (`/`) no se prerrenderizan (usan `dynamic = "force-dynamic"`)
- La compilación pasa (`✓ Compiled successfully`)
- Las páginas estáticas se generan (`✓ Generating static pages (2/2)`)
- El dev server funciona correctamente — solo el build falla por este prerendering
