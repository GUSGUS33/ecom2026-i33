# Funcionalidad: Historial de Pedidos + Repetir Pedido

## Descripción General

Esta funcionalidad permite a los usuarios logueados:

1. **Ver historial de pedidos** en la página `/mis-pedidos`
2. **Expandir cada pedido** para ver sus detalles (artículos, precios, totales)
3. **Repetir un pedido anterior** con un clic, reconstruyendo automáticamente el carrito

## Arquitectura Técnica

### Tablas de Supabase Utilizadas

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `orders` | Almacena pedidos completados | `id`, `supabase_user_id`, `order_number`, `status`, `total_with_vat`, `created_at` |
| `order_items` | Líneas de cada pedido | `order_id`, `product_id`, `variation_id`, `quantity`, `unit_price_with_vat`, `total_with_vat` |
| `carts` | Carrito activo del usuario | `id`, `supabase_user_id`, `status` (active/converted_to_order/abandoned) |
| `cart_items` | Líneas del carrito actual | `cart_id`, `product_id`, `variation_id`, `quantity`, `unit_price_with_vat` |

**RLS (Row Level Security):** Todas las tablas tienen políticas de RLS que garantizan que cada usuario solo puede acceder a sus propios datos (`supabase_user_id = auth.uid()`).

### Servicios Creados

#### `ordersService.ts`

Funciones principales:

```typescript
// Obtiene todas las órdenes del usuario actual, ordenadas por fecha descendente
getUserOrders(limit = 20): Promise<Order[] | null>

// Obtiene los detalles (items) de una orden específica
getOrderDetails(orderId: string): Promise<OrderItem[] | null>

// Obtiene una orden completa con sus detalles
getOrderWithDetails(orderId: string): Promise<{ order: Order; items: OrderItem[] } | null>

// Repite un pedido anterior creando un nuevo carrito
// Implementa Opción B: reutiliza el carrito activo existente si lo hay
repeatOrder(orderId: string): Promise<{ cartId: string; itemsCount: number } | null>
```

### Hooks Creados

#### `useUserOrders.ts`

Hook que encapsula la lógica de obtención de órdenes:

```typescript
useUserOrders(limit = 20) {
  orders: Order[]           // Lista de órdenes del usuario
  isLoading: boolean        // Estado de carga
  error: string | null      // Mensaje de error si aplica
}
```

**Comportamiento:**
- Solo carga órdenes si el usuario está autenticado
- Maneja errores gracefully mostrando mensajes amigables
- Se ejecuta automáticamente al montar el componente

### Componentes Creados

#### `OrdersPage.tsx` (`/mis-pedidos`)

**Características:**

1. **Listado de Órdenes**
   - Muestra número de pedido, fecha, estado y total
   - Diseño responsive (tarjetas en móvil, tabla en escritorio)
   - Ordenadas por fecha descendente (más recientes primero)

2. **Vista Expandible de Detalles**
   - Clic en la tarjeta expande/contrae los detalles
   - Muestra todos los artículos con cantidad, precio unitario y total
   - Resumen de totales (subtotal, IVA, total)
   - Caché de detalles para evitar recargas innecesarias

3. **Botón "Repetir Pedido"**
   - Disponible en la vista expandida
   - Al hacer clic:
     - Crea un nuevo carrito (o reutiliza el existente)
     - Copia todos los items del pedido al carrito
     - Redirige automáticamente a `/carrito`
   - Muestra estado de carga durante la operación
   - Toast de éxito/error

**Rutas:**
- Protegida: Solo usuarios logueados pueden acceder
- Ruta: `/mis-pedidos`
- Registrada en `App.tsx` con `RequireAuth`

**Navegación:**
- Accesible desde el menú desplegable de usuario en el header (nuevo enlace "Mis Pedidos")
- Desde `/mis-pedidos` → clic en "Repetir Pedido" → redirige a `/carrito`

## Lógica de "Repetir Pedido" (Opción B)

### Decisión Tomada

Se implementó **Opción B: Reutilizar carrito existente**, que es más simple y evita acumular carritos abandonados.

### Flujo Paso a Paso

```
1. Usuario hace clic en "Repetir Pedido" en una orden
   ↓
2. Se obtiene la sesión del usuario (auth.uid())
   ↓
3. Se carga la orden y sus items desde Supabase
   ↓
4. Se busca si existe un carrito activo para ese usuario
   ↓
5a. Si existe carrito activo:
    - Limpiar todos los items del carrito existente (DELETE)
    - Reutilizar el mismo cart_id
   ↓
5b. Si NO existe carrito activo:
    - Crear un nuevo carrito con status='active'
    - Usar el nuevo cart_id
   ↓
6. Copiar todos los order_items a cart_items:
   - product_id, variation_id, product_name, product_slug
   - quantity, precios (unitarios y totales)
   - personalization_config (si existe)
   ↓
7. Recalcular y actualizar totales del carrito:
   - subtotal_without_vat = suma de total_without_vat de items
   - total_with_vat = suma de total_with_vat de items
   - vat_amount = total_with_vat - subtotal_without_vat
   ↓
8. Redirigir a /carrito
   ↓
9. Usuario ve el carrito pre-cargado y puede:
   - Cambiar cantidades
   - Eliminar productos
   - Añadir nuevos productos
   - Proceder al checkout
```

### Manejo de Errores

| Error | Comportamiento |
|-------|----------------|
| No hay sesión | Retorna `null`, usuario ve error "No autenticado" |
| Orden no encontrada | Retorna `null`, toast "Pedido no encontrado" |
| Orden sin items | Retorna `null`, toast "El pedido no tiene artículos" |
| Error al crear carrito | Retorna `null`, toast "No pudimos repetir tu pedido" |
| Error al copiar items | Retorna `null`, toast "Error al repetir el pedido" |
| Error al actualizar totales | Se intenta de todas formas, pero no falla la operación |

### Precios y Totales

**Importante:** Los precios se copian como snapshot del pedido original. Esto significa:

- Si un producto cambió de precio desde que se hizo el pedido, el carrito mostrará el precio antiguo
- El usuario puede ver esto y decidir si continúa o cancela
- **Futura mejora:** Validar precios actuales en WooCommerce y mostrar advertencia si hay cambios

## Integración en la UI

### Navegación

1. **Header (MainLayout.tsx)**
   - Nuevo enlace "Mis Pedidos" en el menú desplegable de usuario
   - Solo visible si usuario está logueado
   - Icono: `ShoppingBag`

2. **Rutas Protegidas (App.tsx)**
   - `/mis-pedidos` → `OrdersPage` (protegida con `RequireAuth`)

3. **Flujo de Navegación**
   ```
   Home (/) 
   → Login (/auth/login)
   → Private Home (/inicio)
   → Mis Pedidos (/mis-pedidos)
   → Repetir Pedido
   → Carrito (/carrito)
   → Checkout (/checkout)
   ```

## Tests Implementados

### `ordersService.test.ts`

- ✅ `getUserOrders`: Retorna null si no hay sesión
- ✅ `getUserOrders`: Retorna órdenes del usuario autenticado
- ✅ `getUserOrders`: Maneja errores gracefully
- ✅ `getOrderDetails`: Retorna items de una orden
- ✅ `getOrderDetails`: Retorna null en caso de error
- ✅ `repeatOrder`: Retorna null si no hay sesión
- ✅ `repeatOrder`: Crea carrito y copia items
- ✅ `repeatOrder`: Maneja órdenes vacías

### `useUserOrders.test.ts`

- ✅ Retorna órdenes vacías si no está autenticado
- ✅ Carga órdenes cuando está autenticado
- ✅ Maneja errores gracefully
- ✅ Respeta parámetro `limit`

## Cómo Probar en Desarrollo

### Prerrequisitos

1. Tener Supabase configurado con las tablas `orders`, `order_items`, `carts`, `cart_items`
2. Tener datos de prueba en la tabla `orders` (ver script abajo)
3. Usuario logueado en la aplicación

### Script para Insertar Datos de Prueba

```sql
-- Crear una orden de prueba
INSERT INTO orders (
  supabase_user_id,
  order_number,
  status,
  currency,
  subtotal_without_vat,
  vat_amount,
  total_with_vat,
  billing_address,
  shipping_address,
  notes
) VALUES (
  'YOUR_USER_ID_HERE',  -- Reemplazar con tu user ID de Supabase
  'ORD-TEST-001',
  'completed',
  'EUR',
  100,
  21,
  121,
  '{"city": "Madrid"}',
  '{"city": "Madrid"}',
  'Pedido de prueba'
) RETURNING id;

-- Copiar el ID retornado y usarlo en el siguiente INSERT
INSERT INTO order_items (
  order_id,
  product_id,
  variation_id,
  product_name,
  product_slug,
  quantity,
  unit_price_without_vat,
  unit_price_with_vat,
  total_without_vat,
  total_with_vat,
  personalization_config
) VALUES (
  'ORDER_ID_FROM_ABOVE',  -- Reemplazar con el ID de la orden
  123,
  null,
  'Camiseta Azul',
  'camiseta-azul',
  2,
  50,
  60.5,
  100,
  121,
  null
);
```

### Pasos para Probar el Flujo Completo

1. **Acceder a la aplicación**
   ```
   http://localhost:3000
   ```

2. **Iniciar sesión**
   - Ir a `/auth/login`
   - Usar credenciales de prueba

3. **Navegar a Mis Pedidos**
   - Hacer clic en el avatar/usuario en el header
   - Seleccionar "Mis Pedidos"
   - O ir directamente a `/mis-pedidos`

4. **Ver listado de órdenes**
   - Deberías ver la orden de prueba creada
   - Mostrada con número, fecha, estado y total

5. **Expandir una orden**
   - Hacer clic en la tarjeta de la orden
   - Deberías ver los artículos, precios y totales

6. **Repetir un pedido**
   - Hacer clic en botón "Repetir Pedido"
   - Deberías ver un toast de éxito
   - Serás redirigido a `/carrito`

7. **Verificar carrito**
   - El carrito debe mostrar los artículos del pedido
   - Precios y totales deben coincidir
   - Deberías poder cambiar cantidades, eliminar items, etc.

8. **Ir al checkout**
   - Hacer clic en "Ir al checkout"
   - Deberías ver el resumen del pedido
   - Stripe debe estar desactivado (mensaje "Pago disponible próximamente")

## Notas Importantes

### Stripe Desactivado

El checkout mantiene Stripe desactivado mediante el feature flag `STRIPE_ENABLED`. Esto significa:

- El botón de pago está deshabilitado
- Se muestra un mensaje informativo
- No se realiza ninguna transacción

Esto es intencional para esta fase. Cuando Stripe esté activado, el flujo será:
```
Carrito → Checkout → Pago con Stripe → Crear orden en BD
```

### Precios Históricos

Los precios se copian del pedido original. Si necesitas validar que los precios siguen siendo válidos:

1. Consultar WooCommerce GraphQL API para obtener precios actuales
2. Comparar con los precios del pedido
3. Mostrar advertencia si hay cambios

Esto es una mejora futura que se puede implementar cuando se integre la validación de inventario.

### Productos No Disponibles

Actualmente, no se valida si los productos siguen disponibles en WooCommerce. Mejoras futuras:

1. Consultar disponibilidad en WooCommerce
2. Omitir productos no disponibles al crear el carrito
3. Mostrar advertencia: "Algunos artículos de este pedido ya no están disponibles"

## Archivos Creados/Modificados

### Archivos Creados

```
client/src/services/ordersService.ts
client/src/services/ordersService.test.ts
client/src/hooks/useUserOrders.ts
client/src/hooks/useUserOrders.test.ts
client/src/pages/OrdersPage.tsx
ORDERS-REPEAT-ORDER.md (este archivo)
```

### Archivos Modificados

```
client/src/App.tsx
  - Añadida ruta protegida /mis-pedidos → OrdersPage
  - Lazy load de OrdersPage

client/src/layouts/MainLayout.tsx
  - Nuevo enlace "Mis Pedidos" en menú desplegable de usuario
  - Icono ShoppingBag

client/todo.md
  - Añadidas tareas de historial de pedidos
```

## Decisiones de Diseño

### Por qué Opción B (Reutilizar Carrito)

| Aspecto | Opción A (Nuevo) | Opción B (Reutilizar) |
|--------|------------------|----------------------|
| Complejidad | Media | Baja ✅ |
| Carritos abandonados | Muchos | Pocos ✅ |
| UX | Confuso (múltiples carritos) | Claro (un carrito activo) ✅ |
| Implementación | Más código | Más simple ✅ |

### Por qué Copiar Precios como Snapshot

- Mantiene la integridad histórica del pedido
- Evita cambios inesperados de precio
- Usuario puede decidir si continúa
- Mejora futura: validar y mostrar advertencia

### Por qué Expandible en Lugar de Modal

- Mejor UX en móvil
- No interrumpe el flujo de lectura
- Caché de detalles evita recargas
- Más accesible

## Próximas Fases

1. **Validación de Disponibilidad**
   - Consultar WooCommerce para verificar stock
   - Omitir productos no disponibles
   - Mostrar advertencia al usuario

2. **Validación de Precios**
   - Comparar precios actuales vs históricos
   - Mostrar cambios de precio
   - Permitir aceptar o rechazar

3. **Integración con Stripe**
   - Cuando Stripe esté activado
   - Crear orden en BD tras pago exitoso
   - Enviar confirmación por email

4. **Personalización de Productos**
   - Permitir editar personalizaciones al repetir pedido
   - Guardar configuración en `personalization_config`
   - Mostrar preview de diseño

## Troubleshooting

### "No tienes pedidos aún"

**Causa:** No hay órdenes en la BD para este usuario
**Solución:** Insertar datos de prueba usando el script SQL arriba

### "No pudimos cargar tus pedidos"

**Causa:** Error de conexión con Supabase o RLS
**Solución:** 
- Verificar credenciales de Supabase
- Verificar políticas RLS en tabla `orders`
- Ver console del navegador para más detalles

### Carrito no se carga tras repetir pedido

**Causa:** Error al crear cart_items
**Solución:**
- Verificar RLS en tabla `cart_items`
- Verificar que `supabase_user_id` se pasa correctamente
- Ver logs del servidor

### Precios incorrectos en carrito

**Causa:** Cálculo de IVA incorrecto
**Solución:**
- Verificar que `unit_price_with_vat` incluye IVA
- Verificar cálculo: `unit_price_without_vat = unit_price_with_vat / 1.21`
- Usar `total_with_vat` para totales finales

---

**Última actualización:** Enero 2025  
**Versión:** 1.0  
**Estado:** Implementado y listo para pruebas
