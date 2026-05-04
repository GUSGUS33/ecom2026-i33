# Integración de Datos Reales de WooCommerce en Home Privada

## 📋 Resumen

Se ha conectado exitosamente los bloques "Retoma donde lo dejaste" y "Tus favoritos" de la home privada (`/inicio`) con datos reales de WooCommerce. Los productos ahora muestran nombre, imagen, precio y descuentos en lugar de solo IDs.

---

## 🔧 Cambios Técnicos

### 1. Query GraphQL Nueva: `GET_PRODUCTS_BY_SLUGS`

**Archivo:** `client/src/lib/queries.ts`

```graphql
query GetProductsBySlugs($slugs: [String!]!) {
  products(where: { slugIn: $slugs }, first: 100) {
    nodes {
      id
      name
      slug
      price
      regularPrice
      salePrice
      onSale
      stockStatus
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
}
```

**Características:**
- Obtiene múltiples productos por array de slugs
- Soporta productos simples y variables
- Incluye información de precios y descuentos
- Limita a 100 productos por query

---

### 2. Hooks Personalizados

#### `useViewedProductsWithData`

**Archivo:** `client/src/hooks/useViewedProductsWithData.ts`

**Flujo:**
1. Lee últimos N productos visitados de `Supabase.public.viewed_products`
2. Extrae slugs únicos (elimina duplicados con `Map`)
3. Consulta GraphQL para obtener datos reales
4. Combina datos manteniendo orden original
5. Devuelve: `{ products, loading, error, isEmpty }`

**Deduplicación:**
```typescript
const uniqueSlugs = Array.from(
  new Map(
    viewedProducts.map((p) => [p.product_slug, p.created_at])
  ).entries()
).map(([slug]) => slug);
```

#### `useWishlistProductsWithData`

**Archivo:** `client/src/hooks/useWishlistProductsWithData.ts`

Idéntico a `useViewedProductsWithData` pero lee de `Supabase.public.wishlist`.

---

### 3. Componente ProductCard Reutilizable

**Archivo:** `client/src/pages/PrivateHome.tsx`

```typescript
function ProductCard({
  product,
  href,
}: {
  product: any;
  href: string;
}) {
  // Muestra:
  // - Imagen destacada con fallback
  // - Nombre del producto
  // - Precio con descuento (si aplica)
  // - Badge de % descuento
  // - Enlace a página de producto
}
```

---

### 4. Actualización de PrivateHome

**Archivo:** `client/src/pages/PrivateHome.tsx`

**Cambios:**
- Reemplazó datos hardcodeados por hooks dinámicos
- Implementó estados de carga con spinner
- Añadió mensajes amigables cuando no hay datos
- Muestra badges de descuento en productos en oferta
- Grid responsive (1 col mobile, 2 tablet, 4 desktop)

---

## 🧪 Tests Implementados

### Tests para `useViewedProductsWithData`

**Archivo:** `client/src/hooks/useViewedProductsWithData.test.ts`

- ✅ Retorna productos vacíos si usuario no autenticado
- ✅ Obtiene productos visitados cuando usuario autenticado
- ✅ Elimina duplicados de slugs
- ✅ Maneja errores gracefully

### Tests para `useWishlistProductsWithData`

**Archivo:** `client/src/hooks/useWishlistProductsWithData.test.ts`

- ✅ Retorna productos vacíos si usuario no autenticado
- ✅ Obtiene favoritos cuando usuario autenticado
- ✅ Elimina duplicados de slugs
- ✅ Maneja errores gracefully
- ✅ Mantiene orden original de wishlist

**Total:** 17 tests pasando ✓

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    PrivateHome (/inicio)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼────────────┐
    │ useViewedProductsWithData │    │ useWishlistProductsWithData │
    └───────────┬──────────┘    └──────────┬────────────┘
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼────────────┐
    │ getViewedProducts()  │    │ getWishlistForCurrentUser() │
    │ (Supabase)           │    │ (Supabase)           │
    └───────────┬──────────┘    └──────────┬────────────┘
                │                           │
    ┌───────────▼──────────────────────────▼────────────┐
    │ Deduplicación de slugs (Map)                      │
    └───────────┬──────────────────────────┬────────────┘
                │                           │
    ┌───────────▼──────────────────────────▼────────────┐
    │ useQuery(GET_PRODUCTS_BY_SLUGS)                   │
    │ (GraphQL WooCommerce)                            │
    └───────────┬──────────────────────────┬────────────┘
                │                           │
    ┌───────────▼──────────────────────────▼────────────┐
    │ Combinar datos + mantener orden original          │
    └───────────┬──────────────────────────┬────────────┘
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼────────────┐
    │ ProductCard Grid     │    │ ProductCard Grid     │
    │ (Retoma)             │    │ (Favoritos)          │
    └──────────────────────┘    └──────────────────────┘
```

---

## 🎯 Optimizaciones Implementadas

1. **Evitar queries vacías:** `skip: viewedSlugs.length === 0`
2. **Deduplicación:** Usa `Map` para eliminar slugs duplicados
3. **Orden preservado:** Mantiene orden original de Supabase
4. **Lazy loading:** Solo consulta GraphQL cuando hay slugs
5. **Error handling:** Maneja fallos sin romper la UI
6. **Mobile-first:** Grid responsive desde 1 columna

---

## 📁 Archivos Modificados/Creados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `client/src/lib/queries.ts` | Modificado | Añadida query `GET_PRODUCTS_BY_SLUGS` |
| `client/src/hooks/useViewedProductsWithData.ts` | Nuevo | Hook para productos visitados |
| `client/src/hooks/useViewedProductsWithData.test.ts` | Nuevo | Tests del hook |
| `client/src/hooks/useWishlistProductsWithData.ts` | Nuevo | Hook para favoritos |
| `client/src/hooks/useWishlistProductsWithData.test.ts` | Nuevo | Tests del hook |
| `client/src/pages/PrivateHome.tsx` | Modificado | Integración de datos reales |

---

## 🚀 Próximas Fases

1. **Conectar search_history:** Implementar bloque "Búsquedas recientes"
2. **Página "Mis Favoritos":** Crear página dedicada con filtros y ordenamiento
3. **Carrito de compras:** Usar tablas `carts` y `cart_items`
4. **Integración Stripe:** Pagos y checkout
5. **Analytics:** Tracking de comportamiento del usuario

---

## 🔍 Notas Técnicas

- La query GraphQL usa `slugIn` en lugar de IDs para mayor flexibilidad
- Los hooks manejan automáticamente la autenticación
- Los datos se cachean automáticamente por Apollo Client
- Los tests usan mocks para evitar llamadas reales a APIs
