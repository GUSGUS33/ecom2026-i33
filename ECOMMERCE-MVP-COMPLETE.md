# MVP de Ecommerce Completo - IMPACTO33

## 📋 Resumen Ejecutivo

Se ha implementado un MVP completo de ecommerce con Supabase, incluyendo autenticación, tracking de productos, wishlist, búsquedas recientes y carrito de compras. Todas las funcionalidades están preparadas para la integración con Stripe en la siguiente fase.

---

## 🏗️ Arquitectura Implementada

### Capas de la Aplicación

```
Frontend (React 19 + Tailwind 4)
    ↓
AuthContext (Supabase Auth)
    ↓
Services Layer (Business Logic)
    ├── authService.ts
    ├── userProfileService.ts
    ├── trackingService.ts (viewed_products)
    ├── wishlistService.ts
    ├── searchHistoryService.ts
    └── cartService.ts
    ↓
Supabase (Backend)
    ├── Tables: user_personalization, viewed_products, wishlist, search_history, carts, cart_items
    └── RLS Policies (Row-Level Security)
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. **Registro**: `/auth/register` → Crea usuario en Supabase Auth
2. **Login**: `/auth/login` → Obtiene sesión de Supabase
3. **Redirección**: Post-login → `/inicio` (home personalizada)
4. **Logout**: Cierra sesión y redirige a `/`

### Rutas Protegidas

- `/inicio` - Home personalizada
- `/mi-cuenta` - Perfil de usuario
- `/mis-favoritos` - Página de favoritos
- `/carrito` - Carrito de compras
- `/checkout` - Checkout (preparado para Stripe)

---

## 📊 Tablas de Supabase Utilizadas

### 1. `user_personalization`
```sql
- id (uuid, PK)
- supabase_user_id (uuid, FK → auth.users)
- full_name (text)
- phone (text)
- address (text)
- city (text)
- postal_code (text)
- country (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 2. `viewed_products`
```sql
- id (bigint, PK)
- supabase_user_id (uuid, FK)
- product_id (integer)
- product_slug (text)
- viewed_at (timestamp)
```

### 3. `wishlist`
```sql
- id (bigint, PK)
- supabase_user_id (uuid, FK)
- product_id (integer)
- product_slug (text)
- added_at (timestamp)
```

### 4. `search_history`
```sql
- id (bigint, PK)
- supabase_user_id (uuid, FK)
- query (text)
- created_at (timestamp)
```

### 5. `carts`
```sql
- id (uuid, PK)
- supabase_user_id (uuid, FK)
- status (enum: 'active', 'abandoned', 'completed')
- currency (text, default: 'EUR')
- subtotal_without_vat (numeric)
- vat_amount (numeric)
- total_with_vat (numeric)
- created_at (timestamp)
- updated_at (timestamp)
```

### 6. `cart_items`
```sql
- id (uuid, PK)
- cart_id (uuid, FK)
- product_id (integer)
- product_name (text)
- product_slug (text)
- variation_id (integer, nullable)
- quantity (integer)
- unit_price_with_vat (numeric)
- unit_price_without_vat (numeric)
- total_with_vat (numeric)
- total_without_vat (numeric)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🎯 Funcionalidades Implementadas

### 1. Home Personalizada (`/inicio`)

**Bloques:**
- **Retoma donde lo dejaste**: Últimos 8 productos visitados con datos reales de WooCommerce
- **Tus favoritos**: Últimos 8 productos en wishlist con datos reales
- **Búsquedas recientes**: Últimas 5 keywords buscadas

**Características:**
- Lazy loading con spinner
- Estados de error y vacío
- Datos enriquecidos desde GraphQL
- Deduplicación automática de IDs

### 2. Página "Mis Favoritos" (`/mis-favoritos`)

**Características:**
- Grid responsive de 4 columnas (desktop), 2 (tablet), 1 (mobile)
- Ordenamiento: Reciente, Precio (asc/desc)
- Botón "Quitar de favoritos" por producto
- Botón "Vaciar lista" con confirmación
- Badges de descuento (% off)
- Estados de carga y vacío

### 3. Carrito de Compras (`/carrito`)

**Características:**
- Lista de items con imagen, nombre, precio, cantidad
- Controles para cambiar cantidad (+/- botones)
- Botón eliminar por item
- Resumen con subtotal, IVA (21%), total
- Botón "Vaciar carrito"
- Botón "Ir al checkout"
- Responsive design

### 4. Checkout (`/checkout`)

**Estado Actual:**
- Resumen del pedido
- Información de envío (placeholder)
- Métodos de pago (placeholder para Stripe)
- Totales finales
- Botones deshabilitados (próximamente)

**Preparado para:**
- Integración con Stripe
- Captura de dirección de envío
- Procesamiento de pagos

---

## 🛠️ Servicios Implementados

### authService.ts
```typescript
- signUp(email, password)
- signIn(email, password)
- signOut()
- getCurrentUser()
- getCurrentSession()
```

### userProfileService.ts
```typescript
- getOrCreateProfile(userId)
- updateProfile(userId, data)
- getProfile(userId)
```

### trackingService.ts
```typescript
- trackProductView(productId, productSlug)
- getViewedProducts(limit)
- clearViewedProducts()
```

### wishlistService.ts
```typescript
- addToWishlist(productId, productSlug)
- removeFromWishlist(productId)
- toggleWishlistProduct(productId, productSlug)
- isProductInWishlist(productId)
- getWishlistForCurrentUser(limit)
- clearWishlist()
```

### searchHistoryService.ts
```typescript
- trackSearch(query)
- getRecentSearches(limit)
- clearSearchHistory()
```

### cartService.ts
```typescript
- getOrCreateActiveCartForUser()
- getCartWithItems(cartId)
- addItem(cartId, productId, productName, productSlug, quantity, unitPriceWithVat)
- updateItemQuantity(cartItemId, newQuantity)
- removeItem(cartItemId)
- clearCart(cartId)
```

---

## 🎣 Hooks Personalizados

### useAuth()
```typescript
- user: User | null
- profile: UserProfile | null
- loading: boolean
- error: Error | null
- signUp(email, password)
- signIn(email, password)
- signOut()
```

### useCart()
```typescript
- cart: Cart | null
- items: CartItem[]
- loading: boolean
- error: Error | null
- itemCount: number
- isEmpty: boolean
- addItem(productId, productName, productSlug, quantity, unitPriceWithVat)
- updateQuantity(cartItemId, newQuantity)
- removeItem(cartItemId)
- clearCart()
- reload()
```

### useViewedProductsWithData()
```typescript
- products: ProductWithData[]
- loading: boolean
- error: Error | null
- isEmpty: boolean
```

### useWishlistProductsWithData()
```typescript
- products: ProductWithData[]
- loading: boolean
- error: Error | null
- isEmpty: boolean
```

### useRecentSearches()
```typescript
- searches: SearchHistory[]
- loading: boolean
- error: Error | null
```

---

## 📱 Rutas Implementadas

### Públicas
- `/` - Home pública (SEO)
- `/auth/login` - Login
- `/auth/register` - Registro
- `/producto/:slug` - Detalle de producto
- `/ropa-personalizada` - Categoría
- `/contacto` - Contacto
- etc.

### Protegidas (RequireAuth)
- `/inicio` - Home personalizada
- `/mi-cuenta` - Perfil
- `/mis-favoritos` - Favoritos
- `/carrito` - Carrito
- `/checkout` - Checkout

---

## 🧪 Tests Implementados

**Total: 40+ tests pasando**

### searchHistoryService.test.ts
- trackSearch (autenticación, validación, normalización)
- getRecentSearches (autenticación, ordenamiento, límite)
- clearSearchHistory (autenticación, limpieza)

### cartService.test.ts
- getOrCreateActiveCartForUser (autenticación, creación)
- addItem (autenticación, cálculo de precios)
- updateItemQuantity (eliminación automática)
- clearCart (autenticación, limpieza)

### Hooks Tests
- useViewedProductsWithData (carga, error, vacío)
- useWishlistProductsWithData (carga, error, vacío)
- useCart (carga, operaciones CRUD)

---

## 🔗 Integración con WooCommerce

### Query GraphQL: GET_PRODUCTS_BY_SLUGS
```graphql
query GetProductsBySlugs($slugs: [String!]!) {
  products(where: { slugIn: $slugs }, first: 100) {
    nodes {
      id
      databaseId
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
    }
  }
}
```

### Deduplicación en Frontend
```typescript
const uniqueSlugs = Array.from(new Set(wishlistItems.map(item => item.product_slug)));
```

---

## 💳 Preparación para Stripe (Siguiente Fase)

### Cambios Necesarios:

1. **Instalar Stripe**
   ```bash
   pnpm add @stripe/react-stripe-js @stripe/stripe-js
   ```

2. **Crear CheckoutForm.tsx**
   - Integrar CardElement de Stripe
   - Manejar pagos

3. **Crear endpoint backend**
   - POST `/api/payments/create-payment-intent`
   - POST `/api/payments/confirm-payment`

4. **Actualizar CheckoutPage.tsx**
   - Reemplazar botón deshabilitado
   - Integrar CheckoutForm
   - Manejar confirmación de pago

5. **Crear tabla `payment_events`**
   ```sql
   - id (uuid, PK)
   - order_id (uuid, FK → orders)
   - stripe_payment_intent_id (text)
   - status (enum: 'pending', 'succeeded', 'failed')
   - amount (numeric)
   - created_at (timestamp)
   ```

---

## 🚀 Próximas Fases

### Fase 2: Pagos (Stripe)
- Integración de Stripe
- Procesamiento de pagos
- Confirmación de órdenes
- Emails de confirmación

### Fase 3: Envíos
- Cálculo de costos de envío
- Integración con proveedores
- Tracking de pedidos

### Fase 4: Admin
- Dashboard de órdenes
- Gestión de inventario
- Reportes de ventas

---

## 📝 Notas Técnicas

### Cálculo de IVA
```typescript
const unitPriceWithoutVat = unitPriceWithVat / 1.21;
const totalWithoutVat = unitPriceWithoutVat * quantity;
const vat = totalWithoutVat * 0.21;
const totalWithVat = totalWithoutVat + vat;
```

### RLS Policies
Todas las tablas tienen RLS habilitado:
- Los usuarios solo pueden ver sus propios datos
- Los datos se filtran automáticamente por `supabase_user_id`

### Lazy Loading
- Todos los componentes usan `Suspense` con fallback
- Estados de carga con spinners
- Manejo de errores con mensajes amigables

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos
- `client/src/services/searchHistoryService.ts`
- `client/src/services/cartService.ts`
- `client/src/hooks/useRecentSearches.ts`
- `client/src/hooks/useCart.ts`
- `client/src/pages/FavoritesPage.tsx`
- `client/src/pages/CartPage.tsx`
- `client/src/pages/CheckoutPage.tsx`
- `client/src/services/searchHistoryService.test.ts`
- `client/src/services/cartService.test.ts`

### Modificados
- `client/src/App.tsx` (rutas nuevas)
- `client/src/layouts/MainLayout.tsx` (icono carrito)

---

## ✅ Checklist de Validación

- [x] Autenticación funcional
- [x] Home personalizada con datos reales
- [x] Página de favoritos con ordenamiento
- [x] Carrito con CRUD completo
- [x] Checkout preparado
- [x] Icono carrito en header
- [x] Tests unitarios
- [x] Responsive design
- [x] RLS en Supabase
- [x] Documentación completa

---

## 🎓 Conclusión

El MVP de ecommerce está completamente funcional y listo para la integración con Stripe. Todas las tablas de Supabase están configuradas, los servicios están implementados, y el frontend es totalmente responsive. La arquitectura está preparada para escalar a las siguientes fases.
