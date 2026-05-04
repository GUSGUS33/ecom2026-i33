# Análisis de Rendimiento - Template_PlantillaSEOHeadlessMinimal

## 📊 Análisis Actual

### Cuellos de Botella Identificados

1. **Query GraphQL Monolítica** (IMPACTO ALTO)
   - `GET_SEO_PAGE_COMPLETE` incluye campos para ~25 tipos de bloques diferentes
   - Tamaño estimado: 500-800 líneas de GraphQL
   - Problema: Se traen datos de bloques que no se usan en la página
   - Ejemplo: Una página con solo 3 bloques trae datos de 25 tipos posibles

2. **Múltiples Queries Secuenciales** (IMPACTO MEDIO)
   - Query 1: `GET_SEO_PAGE_COMPLETE` (página + bloques)
   - Query 2: `GET_CHILD_PAGES` (subcategorías para hero y filtros)
   - Query 3: Query de productos (en ProductosDinamicosBlock)
   - Problema: Se ejecutan en cascada, no en paralelo

3. **Imágenes Sin Optimizar** (IMPACTO ALTO)
   - Featured images: 1000x1000px sin lazy loading
   - Imágenes de productos: Tamaños variables sin srcset
   - Problema: Descarga de MBs de imágenes innecesarias

4. **Componentes Pesados Sin Memoization** (IMPACTO MEDIO)
   - `ProductosDinamicosBlock`: Re-renderiza con cada cambio de filtro
   - `HeroWithSubcategories`: Re-renderiza con cambios de estado
   - Problema: Cálculos y renders innecesarios

## ✅ Optimizaciones Ya Implementadas

- ✅ `fetchPolicy: 'cache-first'` en useTransactionalPage
- ✅ Filtrado de bloques vacíos con `useMemo()`
- ✅ Lazy loading de componentes de bloques (dynamic imports implícitos)

## 🚀 Optimizaciones Recomendadas (Prioridad Alta → Baja)

### 1. Lazy Loading de Imágenes (IMPACTO ALTO, ESFUERZO BAJO)

**Problema**: Todas las imágenes se cargan inmediatamente, incluso las below-the-fold.

**Solución**:
```tsx
// Añadir loading="lazy" a TODAS las imágenes
<img 
  src={image.sourceUrl} 
  alt={image.altText}
  loading="lazy" // ← Añadir esto
  className="..."
/>
```

**Impacto**: Reduce carga inicial en 40-60% (solo carga imágenes visibles)

**Archivos a modificar**:
- `client/src/pages/TransactionalPage.tsx` (hero slider)
- `client/src/components/blocks/ProductosDinamicosBlock.tsx` (productos)
- Todos los bloques con imágenes (GaleriaBlock, IconosBlock, etc.)

---

### 2. Implementar Intersection Observer para Bloques (IMPACTO ALTO, ESFUERZO MEDIO)

**Problema**: Todos los bloques se renderizan inmediatamente, incluso los que están fuera de viewport.

**Solución**: Renderizar bloques solo cuando entran en viewport.

```tsx
// Crear componente LazyBlock
import { useInView } from 'react-intersection-observer';

function LazyBlock({ children, threshold = 0.1 }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Solo cargar una vez
    threshold,
  });

  return (
    <div ref={ref}>
      {inView ? children : <div style={{ minHeight: '400px' }} />}
    </div>
  );
}

// Usar en BlockRenderer
<LazyBlock>
  <BlockComponent {...blockProps} />
</LazyBlock>
```

**Dependencia**: `npm install react-intersection-observer`

**Impacto**: Reduce tiempo de carga inicial en 30-50% (solo renderiza bloques visibles)

---

### 3. Memoizar Componentes Pesados (IMPACTO MEDIO, ESFUERZO BAJO)

**Problema**: Componentes se re-renderizan innecesariamente.

**Solución**:
```tsx
// En ProductosDinamicosBlock.tsx
export const ProductosDinamicosBlock = React.memo(function ProductosDinamicosBlock({ ... }) {
  // ... código existente
});

// En HeroWithSubcategories
const HeroWithSubcategories = React.memo(function HeroWithSubcategories({ ... }) {
  // ... código existente
});
```

**Impacto**: Reduce re-renders en 20-40% (evita cálculos innecesarios)

---

### 4. Prefetch de Páginas Hermanas/Hijas (IMPACTO MEDIO, ESFUERZO MEDIO)

**Problema**: Al hacer click en una subcategoría, hay delay mientras carga la página.

**Solución**: Prefetch con `<link rel="prefetch">` en hover.

```tsx
// En slider de subcategorías
<Link
  href={childPage.uri}
  onMouseEnter={() => {
    // Prefetch página al hacer hover
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = childPage.uri;
    document.head.appendChild(link);
  }}
>
  ...
</Link>
```

**Impacto**: Navegación instantánea (página ya cargada al hacer click)

---

### 5. Optimizar Query de Productos (IMPACTO MEDIO, ESFUERZO MEDIO)

**Problema**: Query de productos trae TODOS los campos, incluyendo descripciones largas.

**Solución**: Crear query específica para listado (sin descripción completa).

```graphql
# Query optimizada para listado
query GetProductsForListing($categorySlug: String!) {
  products(where: { categoryIn: [$categorySlug] }, first: 20) {
    nodes {
      id
      name
      slug
      image {
        sourceUrl(size: WOOCOMMERCE_THUMBNAIL) # ← Tamaño específico
      }
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        price
        variations(first: 50) {
          nodes {
            id
            name
            price
            image {
              sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
            }
          }
        }
      }
    }
  }
}
```

**Impacto**: Reduce tamaño de respuesta en 50-70% (solo datos necesarios)

---

### 6. Implementar Caché Persistente de Apollo (IMPACTO BAJO, ESFUERZO MEDIO)

**Problema**: Caché se pierde al recargar página.

**Solución**: Guardar caché en localStorage.

```tsx
// En client/src/lib/apollo.ts
import { InMemoryCache } from '@apollo/client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache();

// Persistir caché
await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  maxSize: 1048576, // 1MB
});
```

**Dependencia**: `npm install apollo3-cache-persist`

**Impacto**: Páginas visitadas cargan instantáneamente (desde caché local)

---

### 7. Dividir Query Monolítica (IMPACTO BAJO, ESFUERZO ALTO)

**Problema**: GET_SEO_PAGE_COMPLETE es muy grande.

**Solución**: Usar fragments y queries separadas por tipo de bloque.

**⚠️ NO RECOMENDADO**: Requiere refactorización masiva con poco beneficio real (GraphQL ya optimiza esto server-side).

---

## 📈 Impacto Estimado Total

Implementando optimizaciones 1-5:

- **Tiempo de carga inicial**: -50% a -70%
- **Tiempo hasta interactividad (TTI)**: -40% a -60%
- **Largest Contentful Paint (LCP)**: -30% a -50%
- **First Input Delay (FID)**: -20% a -40%

## 🎯 Plan de Implementación Recomendado

### Fase 1: Quick Wins (1-2 horas)
1. Añadir `loading="lazy"` a todas las imágenes
2. Memoizar componentes pesados con `React.memo()`

### Fase 2: Optimizaciones Medias (2-4 horas)
3. Implementar Intersection Observer para bloques
4. Optimizar query de productos

### Fase 3: Optimizaciones Avanzadas (4-8 horas)
5. Implementar prefetch de páginas
6. Implementar caché persistente

## 🔍 Herramientas de Testing

- **Lighthouse**: `npm run build && npx serve dist` → Chrome DevTools → Lighthouse
- **WebPageTest**: https://www.webpagetest.org/
- **React DevTools Profiler**: Identificar componentes lentos

## 📝 Notas Adicionales

- **Priorizar móvil**: 70% del tráfico es móvil, optimizar para 3G/4G
- **Monitorear bundle size**: `npm run build` → revisar tamaño de chunks
- **Considerar CDN**: Servir imágenes desde CDN (Cloudflare, Cloudinary)
